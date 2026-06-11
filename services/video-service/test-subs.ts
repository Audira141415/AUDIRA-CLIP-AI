import * as fs from 'fs';
import * as path from 'path';

export class SubtitleGenerator {
  static generateAssSubtitles(videoId: string, transcript: any[], clipStartTime: number, clipEndTime: number): string {
    const assFilename = `subs-${videoId}.ass`;
    const assPath = path.join(process.cwd(), 'uploads', assFilename);
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(path.join(process.cwd(), 'uploads'))) {
      fs.mkdirSync(path.join(process.cwd(), 'uploads'));
    }

    let assContent = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Hormozi,Impact,95,&H00FFFFFF,&H000000FF,&H00000000,&H90000000,-1,0,0,0,100,100,0,0,1,8,12,2,40,40,450,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

    for (const segment of transcript) {
      if (segment.end > clipStartTime && segment.start < clipEndTime) {
        const adjustedStart = Math.max(0, segment.start - clipStartTime);
        const adjustedEnd = Math.min(clipEndTime - clipStartTime, segment.end - clipStartTime);
        const duration = adjustedEnd - adjustedStart;
        
        if (duration > 0.1) {
          const hasWordTimestamps = segment.words && segment.words.length > 0;
          let words = segment.words;
          
          if (!hasWordTimestamps) {
            const splitText = segment.text.trim().split(/\s+/);
            const wordDuration = duration / splitText.length;
            words = splitText.map((w: string, idx: number) => ({
              word: w,
              start: segment.start + (idx * wordDuration),
              end: segment.start + ((idx + 1) * wordDuration)
            }));
          }
          
          const chunks: any[] = [];
          const chunkSize = 3; 
          for (let i = 0; i < words.length; i += chunkSize) {
            chunks.push(words.slice(i, i + chunkSize));
          }

          for (let i = 0; i < chunks.length; i++) {
            const chunkWords = chunks[i];
            
            for (let wIdx = 0; wIdx < chunkWords.length; wIdx++) {
              const activeWord = chunkWords[wIdx];
              let wordStart = activeWord.start - clipStartTime;
              let wordEnd = activeWord.end - clipStartTime;
              
              if (wordStart < 0) {
                 wordStart = adjustedStart + ((i * chunkSize + wIdx) * 0.5);
                 wordEnd = wordStart + 0.5;
              }

              const formattedWords = chunkWords.map((wObj: any, index: number) => {
                const w = wObj.word.toUpperCase(); 
                if (index === wIdx) {
                  return `{\\c&H00FFFF&\\fscx120\\fscy120\\t(0,100,\\fscx100\\fscy100)}${w}{\\c&HFFFFFF&\\fscx100\\fscy100}`;
                } else {
                  return `{\\c&HFFFFFF&\\fscx100\\fscy100}${w}`;
                }
              });
              
              const text = formattedWords.join(' ');
              assContent += `Dialogue: 0,${this.formatAssTime(wordStart)},${this.formatAssTime(wordEnd)},Hormozi,,0,0,0,,${text}\n`;
            }
          }
        }
      }
    }

    fs.writeFileSync(assPath, assContent, 'utf-8');
    return assPath;
  }

  private static formatAssTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const cs = Math.floor((seconds % 1) * 100); 
    
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  }
}

// TEST EXECUTION
const dummyTranscript = [
  {
    start: 10,
    end: 12,
    text: "RAHASIA VIRAL MENIT INI"
  }
];

console.log("Generating subtitles...");
const resultPath = SubtitleGenerator.generateAssSubtitles("TEST-HOAX", dummyTranscript, 10, 15);
console.log("Generated at:", resultPath);
console.log("------------------- FILE CONTENTS -------------------");
console.log(fs.readFileSync(resultPath, 'utf8'));
