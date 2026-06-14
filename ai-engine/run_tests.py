import os
import subprocess
import sys

def run_cmd(cmd):
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"FAILED: {' '.join(cmd)}\n{result.stderr}")
        return False
    print("SUCCESS")
    return True

def main():
    print("=== Uji Fungsi Implementasi Terakhir ===")
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    python_exe = r".\venv\Scripts\python.exe" if os.path.exists(r".\venv\Scripts\python.exe") else "python"
    
    dummy_video = "dummy.mp4"
    if not os.path.exists(dummy_video):
        print(f"File {dummy_video} tidak ditemukan. Uji coba dibatalkan.")
        sys.exit(1)

    passed = 0
    total = 3

    # 1. Test Tracker
    print("\n[1] Menguji tracker.py...")
    if run_cmd([python_exe, "tracker.py", "--input", dummy_video, "--output", "test_tracked.mp4"]):
        passed += 1
    else:
        print("Catatan: tracker.py gagal mungkin karena masalah kompatibilitas mediapipe dengan Python 3.13.")

    # 2. Test ASS Generator
    print("\n[2] Menguji ass_generator.py...")
    # Buat dummy transcript json
    dummy_json = "test_transcript.json"
    with open(dummy_json, "w", encoding="utf-8") as f:
        f.write('{"segments": [{"start": 0.0, "end": 2.0, "text": "Halo dunia", "words": [{"start": 0.0, "end": 1.0, "word": "Halo"}, {"start": 1.0, "end": 2.0, "word": "dunia"}]}]}')
    
    if run_cmd([python_exe, "ass_generator.py", "--json", dummy_json, "--out", "test_subs.ass"]):
        passed += 1
        
    # 3. Test Hook Generator
    print("\n[3] Menguji hook_generator.py...")
    # Perlu edge-tts dan ffmpeg di system PATH
    hook_out = "test_hook.mp4"
    if run_cmd([python_exe, "hook_generator.py", "--input", dummy_video, "--text", "Halo ini percobaan hook", "--output", hook_out]):
        passed += 1

    # 4. Test Whisper Transcription
    print("\n[4] Menguji main.py (Whisper Transcription)...")
    # Buat file audio sementara karena dummy.mp4 tidak ada audio stream
    temp_audio = "temp_test_audio.mp3"
    run_cmd([python_exe, "-m", "edge_tts", "--text", "halo ini percobaan audio", "--write-media", temp_audio])
    if run_cmd([python_exe, "main.py", "--audio", temp_audio, "--out", "test_whisper.json"]):
        passed += 1
    
    if os.path.exists(temp_audio):
        os.remove(temp_audio)
        
    total = 4
    print(f"\n=== Ringkasan Uji Fungsi: {passed}/{total} Berhasil ===")

if __name__ == "__main__":
    main()
