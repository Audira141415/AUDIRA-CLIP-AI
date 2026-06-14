export interface WordData {
  start: number;
  end: number;
  word: string;
}

export interface SegmentData {
  start: number;
  end: number;
  text: string;
  words?: WordData[];
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const cs = Math.floor((seconds % 1) * 100);
  
  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
}

export function generateHormoziASS(segments: SegmentData[]): string {
  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 1

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Hormozi,Impact,85,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,8,5,5,30,30,960,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  let events = '';
  const MAX_WORDS = 4;

  for (const seg of segments) {
    if (!seg.words || seg.words.length === 0) continue;
    
    let currentBatch: WordData[] = [];
    
    for (let i = 0; i < seg.words.length; i++) {
      currentBatch.push(seg.words[i]);
      
      if (currentBatch.length >= MAX_WORDS || i === seg.words.length - 1) {
        // We have a batch of words. Now we create a Dialogue line for EACH word's active duration.
        const batchStart = currentBatch[0].start;
        const batchEnd = currentBatch[currentBatch.length - 1].end;
        
        for (let j = 0; j < currentBatch.length; j++) {
          const activeWord = currentBatch[j];
          let dialogueText = '';
          
          for (let k = 0; k < currentBatch.length; k++) {
            const w = currentBatch[k];
            // Active word is Yellow (&H0000FFFF) and slightly larger, inactive is White (&H00FFFFFF)
            if (k === j) {
              dialogueText += `{\\c&H00FFFF&}{\\fscx115\\fscy115}${w.word}{\\fscx100\\fscy100}{\\c&HFFFFFF&} `;
            } else {
              dialogueText += `${w.word} `;
            }
          }
          
          // The line lasts exactly for the duration of the active word.
          events += `Dialogue: 0,${formatTime(activeWord.start)},${formatTime(activeWord.end)},Hormozi,,0,0,0,,${dialogueText.trim()}\n`;
        }
        
        currentBatch = [];
      }
    }
  }

  return header + events;
}
