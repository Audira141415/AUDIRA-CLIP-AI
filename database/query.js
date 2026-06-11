const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.video.findUnique({ where: { id: '3d27c080-eb99-4ea7-976b-feb72a1afd6b' } }).then(console.log).finally(() => prisma.$disconnect());
