"use server"

import { prisma } from '@audira/database';
import { revalidatePath } from 'next/cache';

export async function getVideos() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      include: { clips: true }
    });
    return videos;
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return [];
  }
}

export async function getRecentUploads() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3
    });
    return videos;
  } catch (error) {
    console.error("Failed to fetch recent uploads:", error);
    return [];
  }
}

export async function getUploadQueue() {
  try {
    const videos = await prisma.video.findMany({
      where: { status: { in: ['PENDING', 'PROCESSING'] } },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    return videos;
  } catch (error) {
    console.error("Failed to fetch upload queue:", error);
    return [];
  }
}

export async function seedDummyData() {
  try {
    // 1. Create a dummy user
    const dummyUser = await prisma.user.create({
      data: { 
        email: `john.doe.${Date.now()}@example.com`, 
        name: 'John Doe' 
      }
    });

    // 2. Create a dummy workspace
    const dummyWorkspace = await prisma.workspace.create({
      data: { 
        name: 'Personal Workspace', 
        ownerId: dummyUser.id 
      }
    });

    // 3. Create dummy videos
    await prisma.video.createMany({
      data: [
        {
          title: "Podcast Episode #47",
          url: "s3://minio/audira/podcast47.mp4",
          duration: 2712, // 00:45:12 in seconds
          status: 'READY',
          userId: dummyUser.id,
          workspaceId: dummyWorkspace.id,
        },
        {
          title: "Webinar - Data Center",
          url: "s3://minio/audira/webinar.mp4",
          duration: 4530,
          status: 'READY',
          userId: dummyUser.id,
          workspaceId: dummyWorkspace.id,
        },
        {
          title: "Live Stream - Q&A",
          url: "s3://minio/audira/livestream.mp4",
          duration: 9285,
          status: 'READY',
          userId: dummyUser.id,
          workspaceId: dummyWorkspace.id,
        },
        {
          title: "Uploading Video Test",
          url: "s3://minio/audira/test.mp4",
          duration: 0,
          status: 'PROCESSING',
          userId: dummyUser.id,
          workspaceId: dummyWorkspace.id,
        }
      ]
    });

    revalidatePath('/library');
    revalidatePath('/upload');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
}

export async function deleteVideo(id: string) {
  try {
    await prisma.video.delete({ where: { id } });
    revalidatePath('/clipper');
    revalidatePath('/library');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete video:", error);
    return { success: false, error };
  }
}

export async function renameVideo(id: string, newTitle: string) {
  try {
    const updated = await prisma.video.update({
      where: { id },
      data: { title: newTitle }
    });
    revalidatePath('/clipper');
    revalidatePath('/library');
    return { success: true, video: updated };
  } catch (error) {
    console.error("Failed to rename video:", error);
    return { success: false, error };
  }
}

export async function bulkDeleteVideos(ids: string[]) {
  try {
    await prisma.video.deleteMany({ where: { id: { in: ids } } });
    revalidatePath('/clipper');
    return { success: true };
  } catch (error) {
    console.error("Failed to bulk delete:", error);
    return { success: false, error };
  }
}

export async function updateVideoTags(id: string, tags: string[]) {
  try {
    const updated = await prisma.video.update({
      where: { id },
      data: { tags }
    });
    revalidatePath('/clipper');
    return { success: true, video: updated };
  } catch (error) {
    console.error("Failed to update tags:", error);
    return { success: false, error };
  }
}

export async function retryVideoProcessing(id: string) {
  try {
    await prisma.video.update({
      where: { id },
      data: { status: 'PENDING' }
    });
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3345';
    fetch(`${API_URL}/video/process/${id}`, { method: 'POST' })
      .catch(e => console.error("Reprocess trigger failed:", e));

    revalidatePath('/clipper');
    return { success: true };
  } catch (error) {
    console.error("Failed to retry video:", error);
    return { success: false, error };
  }
}
