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
const subtitle_generator_1 = require("./src/subtitle-generator");
const fs = __importStar(require("fs"));
const transcript = [
    { start: 0.0, end: 1.0, text: 'INI', words: [{ word: 'INI', start: 0.0, end: 1.0 }] },
    { start: 1.0, end: 2.0, text: 'ADALAH', words: [{ word: 'ADALAH', start: 1.0, end: 2.0 }] },
    { start: 2.0, end: 3.0, text: 'BUKTI', words: [{ word: 'BUKTI', start: 2.0, end: 3.0 }] },
    { start: 3.0, end: 4.0, text: 'NYATA!', words: [{ word: 'NYATA!', start: 3.0, end: 4.0 }] }
];
const assPath = subtitle_generator_1.SubtitleGenerator.generateAssSubtitles('test-proof', transcript, 0, 5);
console.log('--- HASIL JALUR ABSOLUT ---');
console.log('Path:', assPath);
console.log('\n--- KODE SUBTITLE FFmpeg (ASS) ---');
console.log(fs.readFileSync(assPath, 'utf-8').split('\n').slice(0, 25).join('\n'));
//# sourceMappingURL=test.js.map