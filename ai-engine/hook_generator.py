import argparse
import sys
import os
import subprocess
import tempfile
import re
import json

def run_command(cmd):
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Command failed: {' '.join(cmd)}")
        print(result.stderr)
        sys.exit(1)
    return result

def get_video_info(input_path, ffprobe_path="ffprobe"):
    cmd = [ffprobe_path, "-v", "error", "-select_streams", "v:0", 
           "-show_entries", "stream=width,height,r_frame_rate", "-of", "json", input_path]
    res = subprocess.run(cmd, capture_output=True, text=True)
    info = json.loads(res.stdout)
    stream = info['streams'][0]
    width = stream['width']
    height = stream['height']
    
    # parse r_frame_rate like "30000/1001" or "30/1"
    fps_str = stream['r_frame_rate']
    parts = fps_str.split('/')
    fps = float(parts[0]) / float(parts[1]) if len(parts) == 2 else float(parts[0])
    
    return width, height, fps

def get_audio_duration(audio_path, ffprobe_path="ffprobe"):
    cmd = [ffprobe_path, "-v", "error", "-show_entries", "format=duration", "-of", 
           "default=noprint_wrappers=1:nokey=1", audio_path]
    res = subprocess.run(cmd, capture_output=True, text=True)
    return float(res.stdout.strip())

def main():
    parser = argparse.ArgumentParser(description="Auto Hook Generator")
    parser.add_argument("--input", required=True, help="Input video to extract first frame from")
    parser.add_argument("--text", required=True, help="Hook text to speak and display")
    parser.add_argument("--output", required=True, help="Output hook video segment")
    parser.add_argument("--voice", default="id-ID-ArdiNeural", help="Edge-TTS voice (id-ID-ArdiNeural or id-ID-GadisNeural)")
    parser.add_argument("--gpu-args", help="JSON array of ffmpeg GPU args (e.g. ['-c:v', 'h264_nvenc'])")
    parser.add_argument("--ffmpeg", default="ffmpeg", help="Path to ffmpeg executable")
    parser.add_argument("--ffprobe", default="ffprobe", help="Path to ffprobe executable")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.input):
        print(f"Error: Input file not found {args.input}")
        sys.exit(1)
        
    print("Step 1: Generating TTS Audio...")
    temp_audio = tempfile.NamedTemporaryFile(suffix='.mp3', delete=False).name
    edge_cmd = [
        sys.executable, "-m", "edge_tts",
        "--voice", args.voice,
        "--text", args.text,
        "--write-media", temp_audio
    ]
    run_command(edge_cmd)
    
    audio_duration = get_audio_duration(temp_audio, args.ffprobe)
    # Add 0.5s padding at the end
    total_duration = audio_duration + 0.5
    
    print(f"Step 2: Probing video info... (Audio length: {total_duration}s)")
    width, height, fps = get_video_info(args.input, args.ffprobe)
    
    print("Step 3: Creating visual hook...")
    # Format text: Split into lines of max 3 words
    words = args.text.upper().split()
    lines = []
    current_line = []
    for word in words:
        current_line.append(word)
        if len(current_line) >= 3:
            lines.append(" ".join(current_line))
            current_line = []
    if current_line:
        lines.append(" ".join(current_line))
        
    # Build drawtext filters
    drawtext_filters = []
    line_height = 85
    font_size = 65
    total_text_height = len(lines) * line_height
    start_y = (height // 3) - (total_text_height // 2)
    
    for i, line in enumerate(lines):
        escaped_line = line.replace("'", "'\\\\''").replace(":", "\\\\:").replace("\\", "\\\\\\\\")
        y_pos = start_y + (i * line_height)
        
        # Arial Black font, yellow color (#FFD700), white box
        drawtext_filters.append(
            f"drawtext=text='{escaped_line}':"
            f"fontfile='C\\:/Windows/Fonts/ariblk.ttf':"
            f"fontsize={font_size}:"
            f"fontcolor=#FFD700:"
            f"box=1:boxcolor=white@0.95:boxborderw=15:"
            f"x=(w-text_w)/2:y={y_pos}"
        )
        
    filter_chain = ",".join(drawtext_filters)
    
    # Parse GPU args
    gpu_args = []
    if args.gpu_args:
        try:
            gpu_args = json.loads(args.gpu_args)
        except:
            gpu_args = ["-c:v", "libx264", "-preset", "ultrafast"]
    else:
        gpu_args = ["-c:v", "libx264", "-preset", "ultrafast"]
        
    # FFmpeg command to freeze first frame, blur it slightly, add text and add audio
    ffmpeg_cmd = [
        args.ffmpeg, "-y",
        "-i", args.input,
        "-i", temp_audio,
        "-filter_complex",
        # Extract first frame, apply gblur, loop it, add text
        f"[0:v]trim=0:0.04,loop=loop=-1:size=1:start=0,gblur=sigma=10,setpts=N/{fps}/TB,{filter_chain},trim=0:{total_duration},setpts=PTS-STARTPTS[v];"
        f"[1:a]aresample=44100,apad=whole_dur={total_duration}[a]",
        "-map", "[v]",
        "-map", "[a]",
        "-r", str(fps),
        "-s", f"{width}x{height}",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-ac", "2",
        "-t", str(total_duration)
    ]
    
    ffmpeg_cmd.extend(gpu_args)
    ffmpeg_cmd.append(args.output)
    
    print("Running ffmpeg...")
    run_command(ffmpeg_cmd)
    
    # Cleanup
    os.remove(temp_audio)
    print(f"Successfully generated hook segment at {args.output}")

if __name__ == "__main__":
    main()
