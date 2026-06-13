import argparse
import json
import time
import sys
from faster_whisper import WhisperModel

def main():
    parser = argparse.ArgumentParser(description="Audira Clip AI - Whisper Transcription Engine")
    parser.add_argument("--audio", required=True, help="Path to input audio/video file")
    parser.add_argument("--out", required=True, help="Path to output JSON file")
    parser.add_argument("--language", default="id", help="Target language code (e.g. 'id', 'en')")
    
    args = parser.parse_args()
    
    print(f"Initializing WhisperModel (Model: large-v3, Device: CPU, Compute Type: int8)...")
    # Menggunakan model 'large-v3' untuk akurasi tingkat tinggi (kualitas studio)
    model = WhisperModel("large-v3", device="cpu", compute_type="int8")
    
    print(f"Transcribing {args.audio} with target language '{args.language}'...")
    start_time = time.time()
    
    # Transcribe audio dengan prompt ejaan
    prompt = "Berikut adalah transkripsi bahasa Indonesia yang dieja dengan benar, menggunakan kapitalisasi yang tepat, tanpa disingkat."
    segments, info = model.transcribe(args.audio, beam_size=5, language=args.language, word_timestamps=False, initial_prompt=prompt)
    
    print("Transcription started, detected language '%s' with probability %f" % (info.language, info.language_probability))
    
    results = []
    
    for segment in segments:
        print(f"[-> {segment.end:.2f}s] {segment.text}")
        results.append({
            "start": segment.start,
            "end": segment.end,
            "text": segment.text.strip()
        })
        
    end_time = time.time()
    print(f"Transcription completed in {end_time - start_time:.2f} seconds.")
    
    # Save to JSON
    output_data = {
        "language": info.language,
        "segments": results
    }
    
    with open(args.out, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
        
    print(f"Results saved to {args.out}")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
