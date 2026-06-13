import { NextResponse } from 'next/server';

export async function GET() {
  const statuses = {
    web: 'ACTIVE',
    videoService: 'INACTIVE',
    aiEngine: 'INACTIVE',
    ollama: 'INACTIVE',
    database: 'INACTIVE' // We assume active if video service is active for now, but we can check if needed
  };

  // 1. Check Video Service (NestJS on 3345)
  try {
    const vsRes = await fetch('http://localhost:3345/video/health', { method: 'GET', signal: AbortSignal.timeout(3000) });
    if (vsRes.ok) {
      statuses.videoService = 'ACTIVE';
      statuses.database = 'ACTIVE'; // NestJS is running, implies DB/Redis usually ok
    }
  } catch (e) {
    // Silently fail to avoid console spam during startup
  }

  // 2. Check AI Engine (FastAPI on 8000)
  try {
    const aiRes = await fetch('http://localhost:8000/health', { method: 'GET', signal: AbortSignal.timeout(3000) });
    if (aiRes.ok) {
      statuses.aiEngine = 'ACTIVE';
    }
  } catch (e) {
    // Silently fail to avoid console spam during startup
  }

  // 3. Check Ollama (Local LLM on 11434)
  try {
    const olRes = await fetch('http://127.0.0.1:11434/api/version', { method: 'GET', signal: AbortSignal.timeout(3000) });
    if (olRes.ok) {
      statuses.ollama = 'ACTIVE';
    }
  } catch (e) {
    // Silently fail to avoid console spam during startup
  }

  return NextResponse.json({
    success: true,
    statuses,
    timestamp: new Date().toISOString()
  });
}
