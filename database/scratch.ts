import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const v = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1
  });
  console.log(JSON.stringify(v, null, 2));
}

main().finally(() => prisma.$disconnect());
