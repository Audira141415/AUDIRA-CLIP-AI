import { Controller, Post, Get, Body, Param, Query, BadRequestException } from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  async createProject(
    @Body() body: {
      name: string;
      userId: string;
      workspaceId: string;
      clipIds: string[];
    }
  ) {
    const { name, userId, workspaceId, clipIds } = body;
    if (!name || !userId || !workspaceId) {
      throw new BadRequestException('name, userId, and workspaceId are required');
    }
    if (!clipIds || clipIds.length === 0) {
      throw new BadRequestException('At least one clip must be selected');
    }

    const project = await this.projectService.createProject({ name, userId, workspaceId, clipIds });
    return { success: true, project };
  }

  @Get(':id')
  async getProject(@Param('id') id: string) {
    return this.projectService.getProject(id);
  }

  @Get()
  async listProjects(
    @Query('userId') userId: string,
    @Query('workspaceId') workspaceId: string,
  ) {
    if (!userId || !workspaceId) throw new BadRequestException('userId and workspaceId are required');
    return this.projectService.listProjects(userId, workspaceId);
  }
}
