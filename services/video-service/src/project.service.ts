import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@audira/database';


@Injectable()
export class ProjectService {
  async createProject(data: {
    name: string;
    userId: string;
    workspaceId: string;
    clipIds: string[];
  }) {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        userId: data.userId,
        workspaceId: data.workspaceId,
        clips: {
          create: data.clipIds.map((clipId, index) => ({
            clipId,
            order: index,
          })),
        },
      },
      include: {
        clips: {
          include: { clip: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    return project;
  }

  async getProject(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        clips: {
          include: { clip: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async listProjects(userId: string, workspaceId: string) {
    return prisma.project.findMany({
      where: { userId, workspaceId },
      include: {
        clips: { include: { clip: true }, orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
