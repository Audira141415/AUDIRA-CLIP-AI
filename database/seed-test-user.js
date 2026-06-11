const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const userId = "test-user";
  const workspaceId = "test-workspace";

  try {
    // Upsert User
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: { id: userId },
      create: { id: userId, email: 'test@example.com', name: 'Test User' }
    });

    // Upsert Workspace
    const workspace = await prisma.workspace.upsert({
      where: { id: workspaceId },
      update: {},
      create: { id: workspaceId, name: 'Test Workspace', ownerId: userId }
    });

    console.log('Database seeded successfully with test-user and test-workspace!');
  } catch (e) {
    console.error('Seeding error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
