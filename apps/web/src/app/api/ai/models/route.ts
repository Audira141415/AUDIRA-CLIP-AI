import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Meminta list model langsung dari service Ollama lokal
    const response = await fetch('http://127.0.0.1:11434/api/tags', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store' // selalu ambil data terbaru agar model baru langsung terdeteksi
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, models: data.models });
  } catch (error) {
    console.error('Failed to fetch Ollama models:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Tidak dapat terhubung ke Ollama. Pastikan aplikasi Ollama berjalan di background.',
      models: []
    }, { status: 503 });
  }
}
