import sys
import json
import speech_recognition as sr
import os

def transcribe(audio_path, language="id-ID"):
    r = sr.Recognizer()
    try:
        with sr.AudioFile(audio_path) as source:
            audio = r.record(source)
        # Using Google Web Speech API (free, no key required)
        text = r.recognize_google(audio, language=language)
        print(json.dumps({"success": True, "text": text}))
    except sr.UnknownValueError:
        print(json.dumps({"success": True, "text": ""})) # No speech detected
    except sr.RequestError as e:
        print(json.dumps({"success": False, "error": f"API unavailable: {e}"}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No audio path provided"}))
        sys.exit(1)
        
    audio_file = sys.argv[1]
    lang = sys.argv[2] if len(sys.argv) > 2 else "id-ID"
    
    if not os.path.exists(audio_file):
        print(json.dumps({"success": False, "error": f"File not found: {audio_file}"}))
        sys.exit(1)
        
    transcribe(audio_file, lang)
