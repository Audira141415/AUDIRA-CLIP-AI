const fs = require('fs');
const { WaveFile } = require('wavefile');

async function processAudio() {
    try {
        const audioPath = process.argv[2];
        const lang = process.argv[3] || 'id';

        if (!fs.existsSync(audioPath)) {
            console.log(JSON.stringify({ success: false, error: 'File not found' }));
            process.exit(1);
        }

        // Dynamically import pipeline from transformers
        const { pipeline, env } = await import('@xenova/transformers');
        env.allowLocalModels = true; // Use locally cached models if available

        // 1. Initialize Whisper Base
        const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-base');
        
        // 2. Initialize Emotion Classifier (SST-2 Sentiment)
        const classifier = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');

        // Read and parse WAV
        let buffer = fs.readFileSync(audioPath);
        let wav = new WaveFile(buffer);
        wav.toSampleRate(16000); // Whisper expects 16kHz
        
        let audioData = wav.getSamples();
        if (Array.isArray(audioData)) {
            audioData = audioData.length > 0 ? audioData[0] : new Float32Array(0);
        }
        
        let float32Data;
        if (audioData instanceof Float32Array) {
            float32Data = audioData;
        } else {
            float32Data = new Float32Array(audioData.length);
            for (let i = 0; i < audioData.length; ++i) {
                float32Data[i] = audioData[i] / 32768.0;
            }
        }

        // --- STEP 1: RUN WHISPER (With Timestamps for Smart Trimming) ---
        const transcriptResult = await transcriber(float32Data, {
            language: lang,
            task: 'transcribe',
            return_timestamps: true, // This is the secret for Smart Trimming!
            chunk_length_s: 30 // Prevents warning for clips > 30s
        });

        const text = transcriptResult.text.trim();
        const chunks = transcriptResult.chunks || [];
        
        let actualStart = 0;
        let actualEnd = 0;
        let censorTimestamps = [];
        let censoredText = text;

        const badWords = ['fuck', 'shit', 'bitch', 'asshole', 'anjing', 'bangsat', 'kontol', 'memek', 'ngentot', 'bajingan', 'kampret'];

        if (chunks.length > 0) {
            actualStart = chunks[0].timestamp[0]; // Start of first spoken word
            actualEnd = chunks[chunks.length - 1].timestamp[1]; // End of last spoken word
            
            // TAHAP 2: Bleep Censor Detection
            chunks.forEach(chunk => {
                const chunkText = chunk.text.toLowerCase();
                let hasBadWord = false;
                
                badWords.forEach(badWord => {
                    if (chunkText.includes(badWord)) {
                        hasBadWord = true;
                        // Replace in global text (case-insensitive regex)
                        const regex = new RegExp(`\\b${badWord}\\b`, 'gi');
                        censoredText = censoredText.replace(regex, '***');
                    }
                });

                if (hasBadWord && chunk.timestamp.length === 2) {
                    censorTimestamps.push({
                        start: chunk.timestamp[0],
                        end: chunk.timestamp[1]
                    });
                }
            });
        }

        // --- STEP 2: RUN EMOTION CLASSIFIER ---
        let vibeIndo = "Netral";
        if (text.length > 0) {
            const emotions = await classifier(text);
            const topEmotion = emotions.length > 0 ? emotions[0].label : 'NEUTRAL';
            
            // Map SST-2 English sentiment to Indonesian Vibe
            const emotionMap = {
                'POSITIVE': 'Antusias / Positif 😃',
                'NEGATIVE': 'Tegang / Serius 😨',
                'NEUTRAL': 'Informatif 🎙️'
            };
            vibeIndo = emotionMap[topEmotion] || 'Informatif 🎙️';
        }

        // --- STEP 3: EMOTIONAL JUMP ZOOM DETECTION ---
        let jumpZoomStart = null;
        let jumpZoomEnd = null;
        if (chunks.length > 0) {
            // Find the chunk with an exclamation mark, or the longest chunk
            let bestChunk = chunks.find(c => c.text.includes('!'));
            if (!bestChunk) {
                bestChunk = chunks.reduce((prev, current) => (prev.text.length > current.text.length) ? prev : current);
            }
            if (bestChunk && bestChunk.timestamp.length === 2) {
                jumpZoomStart = bestChunk.timestamp[0];
                jumpZoomEnd = bestChunk.timestamp[1];
            }
        }

        console.log(JSON.stringify({ 
            success: true, 
            text: censoredText,
            actualStart: actualStart,
            actualEnd: actualEnd,
            vibe: vibeIndo,
            censorTimestamps: censorTimestamps,
            jumpZoomStart: jumpZoomStart,
            jumpZoomEnd: jumpZoomEnd
        }));

    } catch (e) {
        console.log(JSON.stringify({ success: false, error: e.message }));
    }
}

processAudio();
