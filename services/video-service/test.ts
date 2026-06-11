import { SubtitleGenerator } from './src/subtitle-generator';
import * as fs from 'fs';

const transcript = [
  { start: 0.0, end: 1.0, text: 'INI', words: [{ word: 'INI', start: 0.0, end: 1.0 }] },
  { start: 1.0, end: 2.0, text: 'ADALAH', words: [{ word: 'ADALAH', start: 1.0, end: 2.0 }] },
  { start: 2.0, end: 3.0, text: 'BUKTI', words: [{ word: 'BUKTI', start: 2.0, end: 3.0 }] },
  { start: 3.0, end: 4.0, text: 'NYATA!', words: [{ word: 'NYATA!', start: 3.0, end: 4.0 }] }
];

const assPath = SubtitleGenerator.generateAssSubtitles('test-proof', transcript, 0, 5);
console.log('--- HASIL JALUR ABSOLUT ---');
console.log('Path:', assPath);

console.log('\n--- KODE SUBTITLE FFmpeg (ASS) ---');
console.log(fs.readFileSync(assPath, 'utf-8').split('\n').slice(0, 25).join('\n'));
