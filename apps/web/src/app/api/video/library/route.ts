import { NextResponse } from 'next/server';
import { prisma } from '@audira/database';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const tab = searchParams.get('tab') || 'ALL';
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    let videos: any[] = [];
    let clips: any[] = [];
    let projects: any[] = [];

    // Sangat disederhanakan untuk Personal Tool
    if (tab === 'ALL') {
      videos = await prisma.video.findMany({
        where: { userId, isDeleted: false },
        orderBy: { createdAt: 'desc' }
      });
    } else if (tab === 'CLIPS') {
      clips = await prisma.clip.findMany({
        where: { video: { userId, isDeleted: false }, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        include: { video: true }
      });
    } else if (tab === 'FAVORITES') {
      videos = await prisma.video.findMany({
        where: { userId, isFavorite: true, isDeleted: false },
        orderBy: { createdAt: 'desc' }
      });
      clips = await prisma.clip.findMany({
        where: { video: { userId }, isFavorite: true, isDeleted: false },
        orderBy: { createdAt: 'desc' }
      });
    } else if (tab === 'TRASH') {
      videos = await prisma.video.findMany({
        where: { userId, isDeleted: true },
        orderBy: { createdAt: 'desc' }
      });
      clips = await prisma.clip.findMany({
        where: { video: { userId }, isDeleted: true },
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json({
      videos,
      clips,
      projects
    });

  } catch (error) {
    console.error('Library error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message, stack: error.stack }, { status: 500 });
  }
}
