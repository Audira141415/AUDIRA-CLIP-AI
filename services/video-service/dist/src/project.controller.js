"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const common_1 = require("@nestjs/common");
const project_service_1 = require("./project.service");
let ProjectController = class ProjectController {
    projectService;
    constructor(projectService) {
        this.projectService = projectService;
    }
    async createProject(body) {
        const { name, userId, workspaceId, clipIds } = body;
        if (!name || !userId || !workspaceId) {
            throw new common_1.BadRequestException('name, userId, and workspaceId are required');
        }
        if (!clipIds || clipIds.length === 0) {
            throw new common_1.BadRequestException('At least one clip must be selected');
        }
        const project = await this.projectService.createProject({ name, userId, workspaceId, clipIds });
        return { success: true, project };
    }
    async getProject(id) {
        return this.projectService.getProject(id);
    }
    async listProjects(userId, workspaceId) {
        if (!userId || !workspaceId)
            throw new common_1.BadRequestException('userId and workspaceId are required');
        return this.projectService.listProjects(userId, workspaceId);
    }
};
exports.ProjectController = ProjectController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "createProject", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getProject", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "listProjects", null);
exports.ProjectController = ProjectController = __decorate([
    (0, common_1.Controller)('project'),
    __metadata("design:paramtypes", [project_service_1.ProjectService])
], ProjectController);
//# sourceMappingURL=project.controller.js.map