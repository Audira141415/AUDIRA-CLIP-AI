// @ts-nocheck
import { streamText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

// Konfigurasi custom provider yang mengarah ke Ollama lokal
const ollama = createOpenAI({
  baseURL: 'http://127.0.0.1:11434/v1',
  apiKey: 'ollama', // API key dummy karena Ollama berjalan di localhost
});

const MODEL_NAME = 'qwen2.5:32b'; 
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3345';

export async function POST(req: Request) {
  const { messages, videoId } = await req.json();

  const systemPrompt = `Anda adalah AI Copilot untuk platform "Audira Clip AI" (aplikasi repurpose video). 
Anda ahli dalam membantu user mengedit video, mencari klip lucu, dan menyarankan optimasi.
Selalu respons dengan bahasa Indonesia yang ramah, asisten-like, dan singkat (maksimal 2 paragraf pendek). 
JIKA user meminta Anda melakukan aksi terkait video (mencari momen lucu, membuat subtitle, auto b-roll, dsb), JANGAN mencoba menjelaskan caranya secara teoritis, TETAPI PANGGIL TOOLS yang sesuai untuk melakukannya!
JANGAN mengirimkan teks panjang lebar jika sebuah tool sudah dipanggil.
` + (videoId ? `\nVideo ID saat ini adalah: ${videoId}` : `\nSaat ini user BELUM memilih video. Mintalah user untuk memilih video terlebih dahulu dari menu dropdown di atas.`);

  const result = await streamText({
    model: ollama(MODEL_NAME),
    system: systemPrompt,
    messages,
    tools: {
      findFunnyMoments: tool({
        description: 'Mencari dan mengekstrak momen-momen lucu atau highlight dari video saat ini.',
        parameters: z.object({
          videoContext: z.string().describe('Konteks atau nama video saat ini, opsional.'),
        }),
        execute: async (_args) => {
          if (!videoId) {
            return { status: 'error', message: 'Tidak ada video yang dipilih. Mohon pilih video terlebih dahulu.' };
          }
          
          try {
            // Check if clips already exist
            const getRes = await fetch(`${API_URL}/video/${videoId}`);
            if (getRes.ok) {
              const data = await getRes.json();
              if (data && data.clips && data.clips.length > 0) {
                return {
                  status: 'success',
                  message: `Ditemukan ${data.clips.length} klip yang sudah di-generate sebelumnya.`,
                  action: 'highlight',
                  results: data.clips.map((c: any) => ({
                    id: c.id,
                    time: `Start: ${c.startTime}s - Dur: ${c.duration}s`,
                    title: c.title
                  }))
                };
              }
            }
            
            // If no clips, trigger processing
            const postRes = await fetch(`${API_URL}/video/process/${videoId}?intent=Funny Moments`, { method: 'POST' });
            if (!postRes.ok) throw new Error('Failed to trigger processing');
            
            return {
              status: 'processing',
              message: 'Pencarian momen lucu sedang diproses di background. Silakan periksa halaman Clipper nanti.',
              action: 'highlight',
              results: []
            };
          } catch (e: any) {
            return { status: 'error', message: `Gagal menghubungi backend: ${e.message}` };
          }
        },
      }),
      generateSubtitles: tool({
        description: 'Membuat subtitle secara otomatis (auto-caption) untuk video saat ini.',
        parameters: z.object({
          language: z.string().describe('Bahasa subtitle yang diminta, misalnya "id" atau "en".'),
        }),
        execute: async ({ language }) => {
          if (!videoId) {
            return { status: 'error', message: 'Tidak ada video yang dipilih. Mohon pilih video terlebih dahulu.' };
          }
          try {
            // Trigger background processing with captions enabled
            const postRes = await fetch(`${API_URL}/video/process/${videoId}?captions=true&lang=${language}`, { method: 'POST' });
            if (!postRes.ok) throw new Error('Failed to trigger processing');
            
            return {
              status: 'processing',
              message: `Pembuatan subtitle bahasa ${language} sedang diproses di background.`,
              action: 'subtitle'
            };
          } catch (e: any) {
            return { status: 'error', message: `Gagal menghubungi backend: ${e.message}` };
          }
        },
      }),
      autoReframe: tool({
        description: 'Mengubah rasio (reframe) video landscape (16:9) menjadi portrait (9:16) untuk TikTok/Shorts/Reels secara otomatis mengikuti wajah (Auto Face Tracking).',
        parameters: z.object({
          platform: z.string().describe('Platform target, misalnya TikTok, Reels, atau Shorts.'),
        }),
        execute: async ({ platform }) => {
          if (!videoId) {
            return { status: 'error', message: 'Tidak ada video yang dipilih. Mohon pilih video terlebih dahulu.' };
          }
          try {
            // Trigger background processing with aspects=9:16
            const postRes = await fetch(`${API_URL}/video/process/${videoId}?aspects=9:16`, { method: 'POST' });
            if (!postRes.ok) throw new Error('Failed to trigger processing');
            
            return {
              status: 'processing',
              message: `Video sedang di-reframe untuk ${platform} di background.`,
              action: 'reframe',
              aspectRatio: '9:16'
            };
          } catch (e: any) {
            return { status: 'error', message: `Gagal menghubungi backend: ${e.message}` };
          }
        },
      }),
    },
    // Ini sangat penting untuk Ollama agar tidak 'tersesat' saat calling tool
    maxSteps: 3, 
  });

  return result.toDataStreamResponse();
}
