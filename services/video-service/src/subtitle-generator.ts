import * as fs from 'fs';
import * as path from 'path';

export class SubtitleGenerator {
  static generateAssSubtitles(videoId: string, transcript: any[], clipStartTime: number, clipEndTime: number): string {
    const assFilename = `subs-${videoId}.ass`;
    const assPath = path.join(process.cwd(), 'uploads', assFilename);
    
    // ASS Header with Hormozi-style massive Impact font, thick black outline, and drop shadow.
    // PlayResX/Y matches our standard 9:16 vertical video resolution (1080x1920).
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
          // Check if we have word-level timestamps (WhisperX format)
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
          const chunkSize = 3; // 3 words per screen looks better
          for (let i = 0; i < words.length; i += chunkSize) {
            chunks.push(words.slice(i, i + chunkSize));
          }

          for (let i = 0; i < chunks.length; i++) {
            const chunkWords = chunks[i];
            
            // For each word in the chunk, we create a separate Dialogue line 
            // that spans only the duration of THAT word.
            // This allows us to highlight the current word perfectly!
            for (let wIdx = 0; wIdx < chunkWords.length; wIdx++) {
              const activeWord = chunkWords[wIdx];
              let wordStart = activeWord.start - clipStartTime;
              let wordEnd = activeWord.end - clipStartTime;
              
              if (wordStart < 0) {
                 // Fallback for mock words
                 wordStart = adjustedStart + ((i * chunkSize + wIdx) * 0.5);
                 wordEnd = wordStart + 0.5;
              }

              // Format the line
              const formattedWords = chunkWords.map((wObj: any, index: number) => {
                const w = wObj.word.toUpperCase(); // OpusClip loves uppercase
                if (index === wIdx) {
                  // Active word: Yellow color (&H00FFFF&), scaled up to 120%, with a slight animation
                  // \\t(0,100,\\fscx100\\fscy100) makes it pop and shrink back to 100%
                  return `{\\c&H00FFFF&\\fscx120\\fscy120\\t(0,100,\\fscx100\\fscy100)}${w}{\\c&HFFFFFF&\\fscx100\\fscy100}`;
                } else {
                  // Inactive word: White color (&HFFFFFF&), normal size
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
    const cs = Math.floor((seconds % 1) * 100); // Centiseconds for ASS (0-99)
    
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  }
}
