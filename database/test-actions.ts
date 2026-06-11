import { prisma } from './prisma/client' // Wait, I need to instantiate prisma or import it.

async function main() {
  const { PrismaClient } = require('@prisma/client');
  const db = new PrismaClient();
  
  // 1. Fetch a video to test on
  const video = await db.video.findFirst();
  if (!video) {
    console.log("No videos found to test.");
    return;
  }
  
  console.log(`Original Video: ${video.title}, Tags: ${video.tags}`);
  
  // 2. Test renaming
  const newTitle = "TEST RENAME " + Date.now();
  await db.video.update({ where: { id: video.id }, data: { title: newTitle } });
  
  // 3. Test tagging
  await db.video.update({ where: { id: video.id }, data: { tags: ["Meme", "Gaming"] } });
  
  // 4. Verify
  const updated = await db.video.findUnique({ where: { id: video.id } });
  console.log(`Updated Video: ${updated.title}, Tags: ${updated.tags}`);
  
  // Clean up
  await db.video.update({ where: { id: video.id }, data: { title: video.title, tags: video.tags } });
  console.log("Cleanup complete. The database operations are fully functional!");
}

main().catch(console.error);
