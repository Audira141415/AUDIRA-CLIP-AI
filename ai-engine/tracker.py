import argparse
import cv2
import json
import sys
import os
import math

def main():
    parser = argparse.ArgumentParser(description="Audira Clip AI - Computer Vision Face Tracker")
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
        
    print(f"Initializing OpenCV Face Tracker for {video_path}...")
    
    # Load OpenCV pre-trained Haar Cascade for face detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.", file=sys.stderr)
        sys.exit(1)
        
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    video_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    video_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    print(f"Video Info: {video_width}x{video_height}, Total Frames: {total_frames}, FPS: {fps}")
    
    if is_render_mode:
        # MODE: DYNAMIC RENDER TO MP4
        # Calculate 9:16 crop dimensions
        target_aspect = 9 / 16
        if video_width / video_height > target_aspect:
            # Video is wider than 9:16 (e.g. 16:9), crop width
            crop_h = video_height
            crop_w = int(crop_h * target_aspect)
        else:
            # Video is taller than 9:16, crop height
            crop_w = video_width
            crop_h = int(crop_w / target_aspect)
            
        print(f"Target Crop Size: {crop_w}x{crop_h}")
            
        # Ensure crop width is even
        if crop_w % 2 != 0: crop_w -= 1
        if crop_h % 2 != 0: crop_h -= 1
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out_writer = cv2.VideoWriter(output_path, fourcc, fps, (crop_w, crop_h))
        
        # Exponential Moving Average for smooth tracking
        alpha = 0.1 # Smoothing factor (lower = smoother but lags, higher = responsive but jittery)
        smoothed_center_x = video_width / 2 # Start at center
        
        frame_idx = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            frame_idx += 1
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Detect faces (scan less frequently or use smaller frame for speed if needed, but per-frame is fine for short clips)
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
            
            target_center_x = smoothed_center_x
            if len(faces) > 0:
                # Find largest face
                largest_face = max(faces, key=lambda rect: rect[2] * rect[3])
                x, y, w, h = largest_face
                target_center_x = x + w/2
                
            # Apply Smoothing (EMA)
            smoothed_center_x = alpha * target_center_x + (1 - alpha) * smoothed_center_x
            
            # Calculate crop boundaries
            half_w = crop_w / 2
            start_x = int(smoothed_center_x - half_w)
            end_x = int(smoothed_center_x + half_w)
            
            # Boundary checks
            if start_x < 0:
                start_x = 0
                end_x = crop_w
            elif end_x > video_width:
                end_x = video_width
                start_x = video_width - crop_w
                
            # Since video_height is usually exactly crop_h, start_y is 0
            start_y = 0
            end_y = crop_h
            
            cropped_frame = frame[start_y:end_y, start_x:end_x]
            
            # If for some reason shape doesn't match perfectly, resize to exact dimensions
            if cropped_frame.shape[0] != crop_h or cropped_frame.shape[1] != crop_w:
                cropped_frame = cv2.resize(cropped_frame, (crop_w, crop_h))
                
            out_writer.write(cropped_frame)
            
            if frame_idx % 30 == 0:
                print(f"Processed {frame_idx}/{total_frames} frames...")
                
        out_writer.release()
        print(f"Dynamic tracked video saved to {output_path}")

    else:
        # MODE: LEGACY FAST SCAN (JSON)
        step = max(1, total_frames // args.sample_frames)
        face_centers = []
        
        for i in range(0, total_frames, step):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)
            ret, frame = cap.read()
            if not ret:
                continue
                
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
            
            for (x, y, w, h) in faces:
                center_x = (x + w/2) / video_width
                face_centers.append(center_x)
                break
                
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

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
