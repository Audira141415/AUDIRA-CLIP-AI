import { NextResponse } from 'next/server';
import { prisma } from '@audira/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const ollama = createOpenAI({
  baseURL: 'http://127.0.0.1:11434/v1',
  apiKey: 'ollama', 
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const videoId = params.id;
    const url = new URL(req.url);
    const intent = url.searchParams.get('intent');

    if (intent === 'Funny Moments') {
      console.log(`[AI Extractor] Memulai analisis naskah untuk video ${videoId}`);

      // 1. Ambil Video dan Subtitle
      const subtitle = await prisma.subtitle.findFirst({
        where: { videoId }
      });

      if (!subtitle) {
         return NextResponse.json({ error: 'Subtitle belum tersedia. Buat subtitle terlebih dahulu.' }, { status: 400 });
      }

      // 2. Format Naskah
      let segments = [];
      try {
        segments = JSON.parse(subtitle.content);
      } catch (e) {
        return NextResponse.json({ error: 'Format subtitle tidak valid' }, { status: 500 });
      }

      let scriptContent = '';
      for (const seg of segments) {
         scriptContent += `[${seg.start} - ${seg.end}]: ${seg.text}\n`;
      }

      // Ambil sebagian naskah saja untuk menghindari kelebihan konteks pada model lokal
      const maxContext = scriptContent.split('\n').slice(0, 300).join('\n');

      const modelName = process.env.OLLAMA_MODEL || 'qwen2.5:32b';
      console.log(`[AI Extractor] Memanggil Ollama (${modelName}) untuk mendeteksi klip viral...`);

      // 3. Panggil Ollama untuk analisa JSON
      try {
        const { object } = await generateObject({
          model: ollama(modelName),
          schema: z.object({
            clips: z.array(z.object({
              title: z.string().describe('Judul klip yang menarik (Hook-oriented)'),
              reason: z.string().describe('Alasan mengapa klip ini lucu/viral dan layak dipotong'),
              startTime: z.number().describe('Waktu mulai klip dalam detik (contoh: 10.5)'),
              endTime: z.number().describe('Waktu akhir klip dalam detik (contoh: 25.5)'),
              duration: z.number().describe('Durasi klip dalam detik')
            }))
          }),
          prompt: `Anda adalah seorang Kurator TikTok profesional.
Tugas Anda adalah menemukan klip paling lucu, viral, atau memiliki "Hook" yang kuat dari transkrip video berikut.
Durasi klip ideal adalah antara 15 hingga 60 detik.
Ekstrak 1 hingga 3 klip terbaik. Pastikan startTime dan endTime sesuai persis dengan rentang waktu di transkrip.

Transkrip Video:
${maxContext}`
        });

        console.log(`[AI Extractor] Berhasil mendeteksi ${object.clips.length} klip.`);

        // 4. Simpan hasil ke Database (Tabel Clip)
        const savedClips = [];
        if (object.clips && object.clips.length > 0) {
          for (const clip of object.clips) {
             const newClip = await prisma.clip.create({
               data: {
                  title: clip.title,
                  url: '', // Belum dirender
                  duration: clip.duration,
                  startTime: clip.startTime,
                  endTime: clip.endTime,
                  reason: clip.reason,
                  score: 95, // Default viral score
                  aspectRatio: '9:16',
                  videoId: videoId
               }
             });
             savedClips.push(newClip);
          }
        }

        return NextResponse.json({ success: true, message: 'Klip berhasil diekstrak', clips: savedClips });

      } catch (aiError) {
        console.error('AI Extractor Failed:', aiError);
        return NextResponse.json({ error: 'AI gagal memproses transkrip. Pastikan model Ollama Anda mendukung pemrosesan JSON.' }, { status: 502 });
      }
    }

    return NextResponse.json({ success: true, message: 'Proses diregistrasi (Background)' });
  } catch (error) {
    console.error('Process error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
