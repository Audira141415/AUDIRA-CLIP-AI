import argparse
import cv2
import json
import sys
import os
import math
import numpy as np
import mediapipe as mp

def calculate_lip_activity(face_landmarks, frame_width, frame_height, prev_lip_distance=None):
    """Calculate lip movement activity score"""
    # Key lip landmarks (MediaPipe Face Mesh indices)
    # Upper lip: 13, Lower lip: 14
    upper_lip = face_landmarks.landmark[13]
    lower_lip = face_landmarks.landmark[14]
    
    # Mouth corners: 61 (left), 291 (right)
    mouth_left = face_landmarks.landmark[61]
    mouth_right = face_landmarks.landmark[291]
    
    # Calculate mouth openness (vertical distance)
    mouth_height = abs(upper_lip.y - lower_lip.y)
    
    # Calculate mouth width (horizontal distance)
    mouth_width = abs(mouth_left.x - mouth_right.x)
    
    # Aspect ratio (height/width) - higher when mouth is open
    if mouth_width > 0:
        aspect_ratio = mouth_height / mouth_width
    else:
        aspect_ratio = 0
    
    # Calculate movement delta (change from previous frame)
    delta = 0
    if prev_lip_distance is not None:
        delta = abs(mouth_height - prev_lip_distance)
    
    # Activity score: combination of openness and movement
    activity_score = (aspect_ratio * 0.4) + (delta * 0.6)
    
    return activity_score, mouth_height

def match_face_id(face_x, prev_faces, threshold=0.1):
    """Simple heuristic to match face IDs across frames based on normalized X coordinate"""
    best_id = None
    min_dist = float('inf')
    
    for fid, data in prev_faces.items():
        dist = abs(face_x - data['x'])
        if dist < min_dist and dist < threshold:
            min_dist = dist
            best_id = fid
            
    return best_id

def main():
    parser = argparse.ArgumentParser(description="Audira Clip AI - MediaPipe Face Tracker")
    parser.add_argument("--video", help="Path to input video file (Legacy mode)")
    parser.add_argument("--out", help="Path to output JSON file (Legacy mode)")
    parser.add_argument("--input", help="Path to input video file (Dynamic Render mode)")
    parser.add_argument("--output", help="Path to output MP4 file (Dynamic Render mode)")
    parser.add_argument("--sample_frames", type=int, default=15, help="Number of frames to sample")
    
    args = parser.parse_args()
    
    # Determine Mode
    video_path = args.video if args.video else args.input
    output_path = args.out if args.out else args.output
    
    if not video_path or not output_path:
        print("Error: Must provide either --video/--out OR --input/--output", file=sys.stderr)
        sys.exit(1)
        
    is_render_mode = output_path.endswith('.mp4')

    if not os.path.exists(video_path):
        print(f"Error: Video file not found: {video_path}", file=sys.stderr)
        sys.exit(1)
        
    print(f"Initializing MediaPipe Face Tracker for {video_path}...")
    
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(
        static_image_mode=False,
        max_num_faces=3,
        refine_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.", file=sys.stderr)
        sys.exit(1)
        
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    video_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    video_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    if is_render_mode:
        # Calculate 9:16 crop dimensions
        target_aspect = 9 / 16
        if video_width / video_height > target_aspect:
            crop_h = video_height
            crop_w = int(crop_h * target_aspect)
        else:
            crop_w = video_width
            crop_h = int(crop_w / target_aspect)
            
        if crop_w % 2 != 0: crop_w -= 1
        if crop_h % 2 != 0: crop_h -= 1
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out_writer = cv2.VideoWriter(output_path, fourcc, fps, (crop_w, crop_h))
        
        alpha = 0.08  # Slower alpha for cinematic smooth panning
        smoothed_center_x = video_width / 2 
        
        prev_faces = {} # fid: {x, lip_distance}
        next_fid = 0
        
        frame_idx = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            frame_idx += 1
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(rgb_frame)
            
            target_center_x = smoothed_center_x
            
            if results.multi_face_landmarks:
                current_faces = {}
                faces_data = []
                
                for face_landmarks in results.multi_face_landmarks:
                    face_x = face_landmarks.landmark[1].x # Nose tip
                    
                    # Try to match face ID
                    matched_id = match_face_id(face_x, prev_faces)
                    if matched_id is None:
                        matched_id = next_fid
                        next_fid += 1
                        
                    prev_lip_dist = prev_faces[matched_id]['lip_distance'] if matched_id in prev_faces else None
                    
                    activity, lip_dist = calculate_lip_activity(
                        face_landmarks, video_width, video_height, prev_lip_dist
                    )
                    
                    current_faces[matched_id] = {
                        'x': face_x,
                        'lip_distance': lip_dist
                    }
                    
                    # Score combination: mostly activity, slightly favor center
                    center_score = 1.0 - abs(face_x - 0.5) / 0.5
                    combined_score = (activity * 0.8) + (center_score * 0.2)
                    
                    faces_data.append({
                        'x': face_x * video_width,
                        'combined_score': combined_score,
                        'activity': activity
                    })
                    
                prev_faces = current_faces
                
                # Pick the face with highest score
                if faces_data:
                    best_face = max(faces_data, key=lambda f: f['combined_score'])
                    # If activity is very low, stay where we are instead of jittering
                    if best_face['activity'] > 0.005: 
                        target_center_x = best_face['x']
                    else:
                        # No one speaking clearly, slowly return to center or stay on last person
                        target_center_x = best_face['x'] # Just stay on best face anyway
            
            smoothed_center_x = alpha * target_center_x + (1 - alpha) * smoothed_center_x
            
            half_w = crop_w / 2
            start_x = int(smoothed_center_x - half_w)
            end_x = int(smoothed_center_x + half_w)
            
            if start_x < 0:
                start_x = 0
                end_x = crop_w
            elif end_x > video_width:
                end_x = video_width
                start_x = video_width - crop_w
                
            start_y = 0
            end_y = crop_h
            
            cropped_frame = frame[start_y:end_y, start_x:end_x]
            if cropped_frame.shape[0] != crop_h or cropped_frame.shape[1] != crop_w:
                cropped_frame = cv2.resize(cropped_frame, (crop_w, crop_h))
                
            out_writer.write(cropped_frame)
            
            if frame_idx % 30 == 0:
                print(f"Processed {frame_idx}/{total_frames} frames...")
                
        out_writer.release()
        print(f"Dynamic tracked video saved to {output_path}")

    else:
        # LEGACY SCAN MODE
        step = max(1, total_frames // args.sample_frames)
        face_centers = []
        
        for i in range(0, total_frames, step):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)
            ret, frame = cap.read()
            if not ret: continue
                
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(rgb_frame)
            
            if results.multi_face_landmarks:
                # Just take the first face found
                face_x = results.multi_face_landmarks[0].landmark[1].x
                face_centers.append(face_x)
                
        if len(face_centers) > 0:
            avg_center = sum(face_centers) / len(face_centers)
        else:
            avg_center = 0.5
            
        output_data = {
            "x_offset": avg_center,
            "faces_detected": len(face_centers)
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2)
            
        print(f"Legacy scan results saved to {output_path}")

    cap.release()
    face_mesh.close()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
