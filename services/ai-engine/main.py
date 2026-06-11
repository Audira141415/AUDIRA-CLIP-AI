import sys
import json
import os
import argparse
import time

try:
    from faster_whisper import WhisperModel
except ImportError:
    print("[AI-Engine] ERROR: faster-whisper not installed! Run pip install faster-whisper")
    sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Audira Real AI Engine (faster-whisper)")
    parser.add_argument("--audio", type=str, required=True, help="Path to input audio/video file")
    parser.add_argument("--out", type=str, required=True, help="Path to output JSON")
    args = parser.parse_args()

    audio_path = args.audio
    out_path = args.out

    print(f"[AI-Engine] Loading faster-whisper model ('base', compute_type='int8' for CPU safety)...")
    start_time = time.time()
    
    # Use "base" or "tiny" for reasonable CPU speed. 
    # int8 quantization drastically reduces memory and compute overhead.
    model = WhisperModel("base", device="cpu", compute_type="int8")
    
    print(f"[AI-Engine] Model loaded in {time.time() - start_time:.2f}s. Processing {audio_path}...", flush=True)
    
    # beam_size=1 is greedy decoding (MUCH faster on CPU)
    segments_generator, info = model.transcribe(audio_path, beam_size=1, word_timestamps=True)

    print(f"[AI-Engine] Detected language '{info.language}' with probability {info.language_probability:.2f}", flush=True)
    
    out_segments = []
    
    # Process segments
    for segment in segments_generator:
        words = []
        if segment.words:
            for w in segment.words:
                words.append({
                    "word": w.word.strip(),
                    "start": w.start,
                    "end": w.end,
                    "score": w.probability,
                    "speaker": "SPEAKER_00" 
                })
        
        out_segments.append({
            "start": segment.start,
            "end": segment.end,
            "text": segment.text.strip(),
            "speaker": "SPEAKER_00",
            "words": words
        })
        safe_text = segment.text.strip().encode('utf-8', 'replace').decode('utf-8', 'ignore')
        print(f"[AI-Engine] Transcribed [{segment.start:.2f}s -> {segment.end:.2f}s]: {safe_text}".encode(sys.stdout.encoding, errors='replace').decode(sys.stdout.encoding), flush=True)

    result_json = { "segments": out_segments }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result_json, f, ensure_ascii=False, indent=2)

    print(f"[AI-Engine] Done! Saved real word-level transcript to {out_path} in {time.time() - start_time:.2f}s", flush=True)

if __name__ == "__main__":
    main()
