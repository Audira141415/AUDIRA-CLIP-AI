import argparse
import cv2
import json
import sys
import os

def main():
    parser = argparse.ArgumentParser(description="Audira Clip AI - Computer Vision Face Tracker")
    parser.add_argument("--video", required=True, help="Path to input video file")
    parser.add_argument("--out", required=True, help="Path to output JSON file")
    parser.add_argument("--sample_frames", type=int, default=15, help="Number of frames to sample")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.video):
        print(f"Error: Video file not found: {args.video}", file=sys.stderr)
        sys.exit(1)
        
    print(f"Initializing OpenCV Face Tracker for {args.video}...")
    
    # Load OpenCV pre-trained Haar Cascade for face detection
    # Menggunakan modul standar OpenCV yang ringan
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    cap = cv2.VideoCapture(args.video)
    if not cap.isOpened():
        print("Error: Could not open video.", file=sys.stderr)
        sys.exit(1)
        
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    video_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    video_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    print(f"Video Info: {video_width}x{video_height}, Total Frames: {total_frames}")
    
    step = max(1, total_frames // args.sample_frames)
    
    face_centers = []
    
    for i in range(0, total_frames, step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ret, frame = cap.read()
        if not ret:
            continue
            
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        
        for (x, y, w, h) in faces:
            # Calculate center X of the face relative to video width (0.0 to 1.0)
            center_x = (x + w/2) / video_width
            face_centers.append(center_x)
            print(f"Found face at Frame {i}: center_x={center_x:.2f}")
            break # Just take the first/largest face found in this frame
            
    cap.release()
    
    # Calculate average face center to determine pan position
    if len(face_centers) > 0:
        avg_center = sum(face_centers) / len(face_centers)
        print(f"Target Acquired. Average Face Center X: {avg_center:.2f}")
    else:
        avg_center = 0.5 # Default to center if no face found
        print(f"No faces detected. Defaulting to center: {avg_center:.2f}")
        
    # Save to JSON
    output_data = {
        "x_offset": avg_center,
        "faces_detected": len(face_centers)
    }
    
    with open(args.out, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2)
        
    print(f"Results saved to {args.out}")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
