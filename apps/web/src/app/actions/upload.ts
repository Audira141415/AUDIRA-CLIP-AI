"use server"

import { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from '@audira/database';
import { revalidatePath } from 'next/cache';

const s3Client = new S3Client({
  region: "us-east-1", // MinIO default
  endpoint: process.env.MINIO_ENDPOINT || "http://localhost:9000",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "root",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "password123",
  },
  forcePathStyle: true, // Required for MinIO
});

export async function getPresignedUrl(fileName: string, contentType: string) {
  try {
    const bucket = process.env.MINIO_BUCKET || "audira";
    
    // Ensure bucket exists
    try {
        await s3Client.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch (err: any) {
        if (err.name === 'NotFound') {
             await s3Client.send(new CreateBucketCommand({ Bucket: bucket }));
        }
    }
    
    const key = `uploads/${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
    
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return { success: true, signedUrl, key };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return { success: false, error: "Failed to generate upload URL" };
  }
}

export async function confirmUpload(fileName: string, fileKey: string, duration: number = 0) {
  try {
    // We should get user/workspace from auth session, using dummy for now
    let user = await prisma.user.findFirst();
    let workspace = await prisma.workspace.findFirst();

    if (!user || !workspace) {
        user = await prisma.user.create({
            data: { email: `dummy${Date.now()}@example.com`, name: 'Dummy User' }
        });
        workspace = await prisma.workspace.create({
            data: { name: 'My Workspace', ownerId: user.id }
        });
    }

    const video = await prisma.video.create({
      data: {
        title: fileName,
        url: `s3://${process.env.MINIO_BUCKET || "audira"}/${fileKey}`,
        duration: duration,
        status: "PROCESSING",
        userId: user.id,
        workspaceId: workspace.id,
      }
    });

    // Trigger AI processing in NestJS worker
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3345';
      fetch(`${API_URL}/video/process/${video.id}`, { method: 'POST' }).catch(e => console.error("NestJS trigger failed:", e));
    } catch (err) {
      console.error("Failed to trigger processing:", err);
    }

    revalidatePath('/upload');
    revalidatePath('/library');

    return { success: true, video };
  } catch (error) {
    console.error("Error confirming upload:", error);
    return { success: false, error: "Failed to confirm upload" };
  }
}
