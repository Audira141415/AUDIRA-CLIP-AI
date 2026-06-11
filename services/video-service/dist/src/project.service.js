"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@audira/database");
let ProjectService = class ProjectService {
    async createProject(data) {
        const project = await database_1.prisma.project.create({
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
    async getProject(id) {
        const project = await database_1.prisma.project.findUnique({
            where: { id },
            include: {
                clips: {
                    include: { clip: true },
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return project;
    }
    async listProjects(userId, workspaceId) {
        return database_1.prisma.project.findMany({
            where: { userId, workspaceId },
            include: {
                clips: { include: { clip: true }, orderBy: { order: 'asc' } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)()
], ProjectService);
//# sourceMappingURL=project.service.js.map