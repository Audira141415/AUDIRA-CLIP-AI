const fs = require('fs');
const { WaveFile } = require('wavefile');

async function transcribe() {
    try {
        const audioPath = process.argv[2];
        const lang = process.argv[3] || 'id';

        if (!fs.existsSync(audioPath)) {
            console.log(JSON.stringify({ success: false, error: 'File not found' }));
            process.exit(1);
        }

        // Dynamically import pipeline from transformers
        const { pipeline, env } = await import('@xenova/transformers');
        
        // Disable local models only to ensure it fetches from huggingface
        env.allowLocalModels = true;

        const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-base');

        // Read and parse WAV
        let buffer = fs.readFileSync(audioPath);
        let wav = new WaveFile(buffer);
        
        // Whisper expects 16000Hz sampling rate
        wav.toSampleRate(16000);
        
        // Whisper expects Float32Array audio data
        let audioData = wav.getSamples();
        if (Array.isArray(audioData)) {
            if (audioData.length > 0) {
                audioData = audioData[0]; // take first channel if stereo
            } else {
                audioData = new Float32Array(0);
            }
        }
        
        // Convert integer samples to Float32 [-1.0, 1.0] if necessary
        let float32Data;
        if (audioData instanceof Float32Array) {
            float32Data = audioData;
        } else {
            float32Data = new Float32Array(audioData.length);
            for (let i = 0; i < audioData.length; ++i) {
                // Assuming 16-bit PCM
                float32Data[i] = audioData[i] / 32768.0;
            }
        }

        // Run transcription
        const result = await transcriber(float32Data, {
            language: lang,
            task: 'transcribe'
        });

        console.log(JSON.stringify({ success: true, text: result.text }));
    } catch (e) {
        console.log(JSON.stringify({ success: false, error: e.message }));
    }
}

transcribe();
