"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtitleGenerator = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class SubtitleGenerator {
    static generateAssSubtitles(videoId, transcript, clipStartTime, clipEndTime) {
        const assFilename = `subs-${videoId}.ass`;
        const assPath = path.join(process.cwd(), 'uploads', assFilename);
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
                        words = splitText.map((w, idx) => ({
                            word: w,
                            start: segment.start + (idx * wordDuration),
                            end: segment.start + ((idx + 1) * wordDuration)
                        }));
                    }
                    const chunks = [];
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
                            const formattedWords = chunkWords.map((wObj, index) => {
                                const w = wObj.word.toUpperCase();
                                if (index === wIdx) {
                                    return `{\\c&H00FFFF&\\fscx120\\fscy120\\t(0,100,\\fscx100\\fscy100)}${w}{\\c&HFFFFFF&\\fscx100\\fscy100}`;
                                }
                                else {
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
    static formatAssTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const cs = Math.floor((seconds % 1) * 100);
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
    }
}
exports.SubtitleGenerator = SubtitleGenerator;
//# sourceMappingURL=subtitle-generator.js.map