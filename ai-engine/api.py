from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
import time
import os
import json
from faster_whisper import WhisperModel
from fastapi import WebSocket, WebSocketDisconnect
import numpy as np
import webrtcvad

app = FastAPI(title="AUDIRA-CLIP-AI Engine API", version="1.0.0")

# Load model ONCE during startup to save memory and time
# Menyimpan model langsung ke dalam folder project agar "ter-bundle" dan bisa offline
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
os.makedirs(MODEL_DIR, exist_ok=True)

print(f"Loading Whisper Model (large-v3) from/to {MODEL_DIR}...")
model = WhisperModel("large-v3", device="cpu", compute_type="int8", download_root=MODEL_DIR)
print("Model loaded successfully!")

@app.get("/health")
async def health_check():
    return {"status": "ok", "model": "small", "device": "cpu"}


class TranscribeRequest(BaseModel):
    audio_path: str
    language: str = "id"

@app.post("/api/transcribe")
async def transcribe(request: TranscribeRequest):
    if not os.path.exists(request.audio_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
        
    print(f"Transcribing {request.audio_path}...")
    start_time = time.time()
    
    try:
        # Menambahkan initial_prompt untuk memandu AI mengeja bahasa Indonesia dengan lebih akurat
        prompt = "Berikut adalah transkripsi bahasa Indonesia yang dieja dengan benar, menggunakan kapitalisasi yang tepat, tanpa disingkat."
        segments, info = model.transcribe(request.audio_path, beam_size=5, language=request.language, word_timestamps=False, initial_prompt=prompt)
        
        results = []
        for segment in segments:
            results.append({
                "start": segment.start,
                "end": segment.end,
                "text": segment.text.strip()
            })
            
        return {
            "success": True,
            "language": info.language,
            "language_probability": info.language_probability,
            "segments": results,
            "time_taken": time.time() - start_time
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

vad = webrtcvad.Vad(2)

@app.websocket("/api/stream")
async def websocket_stream(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connected for streaming")
    
    audio_buffer = bytearray()
    silence_counter = 0
    
    try:
        while True:
            data = await websocket.receive_bytes()
            # data is expected to be raw PCM 16kHz 16-bit mono
            audio_buffer.extend(data)
            
            frame_length = 320 # 20ms at 16000Hz
            if len(data) >= frame_length:
                frames = [data[i:i + frame_length] for i in range(0, len(data), frame_length) if len(data[i:i + frame_length]) == frame_length]
                speech_detected = False
                for frame in frames:
                    if vad.is_speech(frame, 16000):
                        speech_detected = True
                        break
                
                if not speech_detected:
                    silence_counter += 1
                else:
                    silence_counter = 0
            
            audio_np = np.frombuffer(audio_buffer, dtype=np.int16).astype(np.float32) / 32768.0
            
            if len(audio_np) > 16000 * 0.5: # At least 0.5s of audio to transcribe
                prompt = "Berikut adalah transkripsi bahasa Indonesia yang dieja dengan benar, menggunakan kapitalisasi yang tepat, tanpa disingkat."
                segments, _ = model.transcribe(audio_np, beam_size=1, language="id", word_timestamps=False, initial_prompt=prompt, condition_on_previous_text=False)
                
                text = " ".join([s.text.strip() for s in segments])
                is_final = silence_counter > 2 # e.g. 3 chunks of silence means end of sentence
                
                if text:
                    await websocket.send_json({
                        "text": text,
                        "is_final": is_final
                    })
                
                if is_final:
                    audio_buffer = bytearray()
                    silence_counter = 0
                    
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
