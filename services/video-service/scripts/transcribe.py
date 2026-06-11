import sys
import os
import json

def format_timestamp(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

def main():
    if len(sys.argv) < 3:
        print("Usage: python transcribe.py <video_path> <output_json_path>")
        sys.exit(1)

    video_path = sys.argv[1]
    output_json = sys.argv[2]
    
    try:
        # Import inside try block to allow graceful fallback if not installed
        from faster_whisper import WhisperModel
    except ImportError:
        print(json.dumps({"error": "faster-whisper not installed"}))
        sys.exit(1)

    model_size = "tiny"
    try:
        # Run on CPU with int8 for fast local inference
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        
        # Transcribe with language set to Indonesian (id)
        segments, info = model.transcribe(video_path, language="id")
        
        result_segments = []
        for segment in segments:
            result_segments.append({
                "start": segment.start,
                "end": segment.end,
                "text": segment.text.strip()
            })
            
        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump(result_segments, f)
            
        print(json.dumps({"success": True, "count": len(result_segments)}))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
