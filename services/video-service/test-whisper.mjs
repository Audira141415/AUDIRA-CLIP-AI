import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
import wavefile from 'wavefile';

async function test() {
  console.log('▶ Menyiapkan file uji coba (Ekstraksi Audio)...');
  const videoPath = path.join(process.cwd(), 'uploads', 'import-1780844757300-312144452.mp4');
  const wavPath = path.join(process.cwd(), 'uploads', 'test-audio.wav');
  
  if (!fs.existsSync(videoPath)) {
      console.log('File video tidak ditemukan!');
      return;
  }

  await new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec('pcm_s16le')
      .audioFrequency(16000)
      .audioChannels(1)
      .output(wavPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });

  console.log('✅ Audio siap. Membaca format WAV...');
  
  const wavBuffer = fs.readFileSync(wavPath);
  const wav = new wavefile.WaveFile(wavBuffer);
  wav.toBitDepth('32f');
  wav.toSampleRate(16000);
  
  let audioData = wav.getSamples();
  if (Array.isArray(audioData)) audioData = audioData[0];

  console.log('🤖 Mengunduh/Membangun Model Whisper (Local ASR)...');
  const transformers = await import('@xenova/transformers');
  transformers.env.allowLocalModels = true;
  const transcriber = await transformers.pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny');

  console.log('👂 Mendengarkan suara secara nyata...');
  const output = await transcriber(audioData, { return_timestamps: true, chunk_length_s: 30 });

  console.log('\n==================================');
  console.log('📝 HASIL TRANSKRIPSI ASLI DARI AI:');
  console.log('==================================');
  
  if (output && output.chunks) {
      output.chunks.forEach(chunk => {
          console.log(`[${chunk.timestamp[0].toFixed(1)}s - ${chunk.timestamp[1] ? chunk.timestamp[1].toFixed(1) : 'end'}s] ${chunk.text}`);
      });
  } else {
      console.log(output);
  }
  
  console.log('==================================');
  
  // Cleanup
  fs.unlinkSync(wavPath);
}

test().catch(console.error);
