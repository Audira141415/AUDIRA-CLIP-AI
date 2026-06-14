import json
import sys
import argparse
import os

def format_time(seconds: float) -> str:
    """Convert seconds to ASS time format"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    centisecs = int((seconds % 1) * 100)
    return f"{hours}:{minutes:02d}:{secs:02d}.{centisecs:02d}"

def create_ass_subtitle(transcript_json_path: str, output_path: str):
    if not os.path.exists(transcript_json_path):
        print(f"Error: File {transcript_json_path} not found.")
        sys.exit(1)
        
    with open(transcript_json_path, 'r', encoding='utf-8') as f:
        transcript = json.load(f)

    ass_content = """[Script Info]
Title: Auto-generated captions
ScriptType: v4.00+
WrapStyle: 0
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial Black,65,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,4,2,2,50,50,400,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    events = []
    
    segments = transcript.get("segments", [])
    for segment in segments:
        words = segment.get("words", [])
        if words:
            chunk_size = 4
            for i in range(0, len(words), chunk_size):
                chunk = words[i:i + chunk_size]
                if not chunk: continue
                
                for j, current_word in enumerate(chunk):
                    word_start = current_word.get("start", 0)
                    word_end = current_word.get("end", 0)
                    
                    text_parts = []
                    for k, w in enumerate(chunk):
                        word_text = w.get("word", "").strip().upper()
                        if k == j:
                            text_parts.append(f"{{\\c&H00FFFF&}}{word_text}{{\\c&HFFFFFF&}}")
                        else:
                            text_parts.append(word_text)
                            
                    text = " ".join(text_parts)
                    events.append({
                        'start': format_time(word_start),
                        'end': format_time(word_end),
                        'text': text
                    })
        else:
            # Fallback
            start = segment.get("start", 0)
            end = segment.get("end", 0)
            text = segment.get("text", "").strip().upper()
            if text:
                events.append({
                    'start': format_time(start),
                    'end': format_time(end),
                    'text': text
                })
                
    for event in events:
        ass_content += f"Dialogue: 0,{event['start']},{event['end']},Default,,0,0,0,,{event['text']}\n"
        
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ass_content)
    print(f"ASS generated at {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", required=True, help="Input JSON transcript with words array")
    parser.add_argument("--out", required=True, help="Output .ass file path")
    args = parser.parse_args()
    create_ass_subtitle(args.json, args.out)
