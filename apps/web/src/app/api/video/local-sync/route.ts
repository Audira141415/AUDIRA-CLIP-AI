import { NextResponse } from 'next/server';
import { prisma } from '@audira/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { folderPath = 'videos' } = body; 
    
    // Asumsikan foldernya ada di dalam direktori `public` Next.js
    // atau bisa di path absolut jika Anda memasukkan C:/MyVideos
    let absolutePath = '';
    
    // Cek apakah ini absolute path Windows/Linux
    if (path.isAbsolute(folderPath)) {
      absolutePath = folderPath;
    } else {
      absolutePath = path.resolve(process.cwd(), 'public', folderPath);
    }

    if (!fs.existsSync(absolutePath)) {
      // Buat foldernya jika belum ada untuk menghindari error
      fs.mkdirSync(absolutePath, { recursive: true });
    }

    const files = fs.readdirSync(absolutePath);
    const videoFiles = files.filter(f => /\.(mp4|mov|mkv|webm)$/i.test(f));

    let syncedCount = 0;

    for (const file of videoFiles) {
      // Gunakan relative path untuk web URL jika ada di dalam public/
      let storagePath = '';
      if (absolutePath.includes(path.resolve(process.cwd(), 'public'))) {
        storagePath = `/${folderPath}/${file}`;
      } else {
        // Jika absolute path eksternal, agak rumit diakses Next.js public, 
        // tapi kita bisa simpan path fisiknya.
        storagePath = path.join(absolutePath, file);
      }

      // Cek apakah video sudah ada
      const existing = await prisma.video.findFirst({
        where: {
          url: storagePath,
          userId: session.user.id
        }
      });

      if (!existing) {
        // Asumsi workspace pertama adalah default
        const workspaceMember = await prisma.workspaceMember.findFirst({
          where: { userId: session.user.id }
        });

        if (workspaceMember) {
          await prisma.video.create({
            data: {
              title: file,
              url: storagePath,
              duration: 0, // Dalam app nyata, Anda bisa baca metadata video dengan ffmpeg
              status: 'READY',
              userId: session.user.id,
              workspaceId: workspaceMember.workspaceId
            }
          });
          syncedCount++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Berhasil sinkronisasi ${syncedCount} video baru dari folder lokal.`,
      syncedCount 
    });

  } catch (error) {
    console.error('Local sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
