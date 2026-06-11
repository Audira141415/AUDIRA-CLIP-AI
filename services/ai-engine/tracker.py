import cv2
import argparse
import sys
import os

def smooth_coordinates(values, window_size=15):
    """
    Applies a simple moving average to stabilize camera movement
    so the video doesn't jitter rapidly when the person moves slightly.
    """
    if not values:
        return []
    smoothed = []
    for i in range(len(values)):
        start = max(0, i - window_size)
        end = min(len(values), i + window_size + 1)
        window = values[start:end]
        smoothed.append(int(sum(window) / len(window)))
    return smoothed

def track_and_crop(input_path, output_path):
    print(f"[Tracker] Starting OpenCV Face Tracking for: {input_path}")
    
    if not os.path.exists(input_path):
        print(f"[Tracker] Error: File {input_path} not found.")
        sys.exit(1)
        
    try:
        cap = cv2.VideoCapture(input_path)
    except Exception as e:
        print(f"[Tracker] OpenCV Error: {e}")
        sys.exit(1)
        
    if not cap.isOpened():
        print(f"[Tracker] Error: Cannot open video stream.")
        sys.exit(1)
        
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    # 9:16 Target Aspect Ratio (TikTok/Reels format)
    out_height = height
    out_width = int(height * 9 / 16)
    
    default_x = (width - out_width) // 2
    
    # Load OpenCV Haar Cascade for fast CPU face tracking
    # We use Haar instead of FaceNet here to ensure real-time performance on CPU
    cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(cascade_path)
    
    frames_x = []
    frames = []
    last_x = default_x
    
    print("[Tracker] Scanning frames for faces...")
    
    count = 0
    # Process up to 60 seconds of video to avoid extremely long rendering in dev
    while True:
        ret, frame = cap.read()
        if not ret or count > int(fps * 60):
            break
            
        frames.append(frame)
        
        # Optimize: Only run heavy face detection every 3 frames
        if count % 3 == 0:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            # Detect faces
            faces = face_cascade.detectMultiScale(
                gray, 
                scaleFactor=1.1, 
                minNeighbors=5, 
                minSize=(50, 50)
            )
            
            if len(faces) > 0:
                # Prioritize the largest face (the active speaker usually)
                faces = sorted(faces, key=lambda x: x[2]*x[3], reverse=True)
                fx, fy, fw, fh = faces[0]
                
                # Find center of face
                face_center_x = fx + fw // 2
                
                # Calculate the left X coordinate for the 9:16 crop box
                crop_x = face_center_x - (out_width // 2)
                
                # Keep within video bounds
                crop_x = max(0, min(crop_x, width - out_width))
                last_x = crop_x
        
        frames_x.append(last_x)
        count += 1
            
    cap.release()
    
    print(f"[Tracker] Applying Camera Stabilization (Moving Average)...")
    smoothed_x = smooth_coordinates(frames_x, window_size=15)
    
    print(f"[Tracker] Rendering {len(frames)} frames to {output_path}...")
    # Render Output using H264
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (out_width, out_height))
    
    for i in range(len(frames)):
        cx = smoothed_x[i]
        cropped = frames[i][0:out_height, cx:cx+out_width]
        out.write(cropped)
        
    out.release()
    print("[Tracker] Tracking & Cropping completed successfully!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="OpenCV Dynamic Face Tracker")
    parser.add_argument("--input", required=True, help="Input raw clip MP4")
    parser.add_argument("--output", required=True, help="Output dynamically cropped MP4")
    args = parser.parse_args()
    
    track_and_crop(args.input, args.output)
