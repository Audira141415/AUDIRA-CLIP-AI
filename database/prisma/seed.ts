import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create a dummy user
  const user = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
  });
  console.log(`Created user with id: ${user.id}`);

  // 2. Create a dummy workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: "John's Workspace",
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: 'OWNER',
        },
      },
    },
  });
  console.log(`Created workspace with id: ${workspace.id}`);

  // 3. Create dummy videos
  const videos = await Promise.all([
    prisma.video.create({
      data: {
        title: 'Podcast Episode #47.mp4',
        url: 'http://localhost:3001/uploads/podcast47.mp4',
        duration: 2712, // 45:12
        status: 'READY',
        userId: user.id,
        workspaceId: workspace.id,
        clips: {
          create: [
            {
              title: 'Viral Hook Moment',
              url: 'http://localhost:3001/uploads/clip1.mp4',
              duration: 15,
              score: 96,
            },
            {
              title: 'Funny Reaction',
              url: 'http://localhost:3001/uploads/clip2.mp4',
              duration: 12,
              score: 89,
            },
          ],
        },
      },
    }),
    prisma.video.create({
      data: {
        title: 'Webinar - Data Center.mp4',
        url: 'http://localhost:3001/uploads/webinar.mp4',
        duration: 3600,
        status: 'READY',
        userId: user.id,
        workspaceId: workspace.id,
      },
    }),
  ]);

  console.log(`Created ${videos.length} dummy videos.`);
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
