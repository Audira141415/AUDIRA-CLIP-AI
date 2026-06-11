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
exports.VideoController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const video_service_1 = require("./video.service");
const multer_1 = require("multer");
const path_1 = require("path");
let VideoController = class VideoController {
    videoService;
    constructor(videoService) {
        this.videoService = videoService;
    }
    async getStats(userId, workspaceId) {
        if (!userId || !workspaceId)
            throw new common_1.BadRequestException('userId and workspaceId are required');
        return this.videoService.getDashboardStats(userId, workspaceId);
    }
    async getLibrary(userId, workspaceId, tab, sortBy, folder) {
        if (!userId || !workspaceId)
            throw new common_1.BadRequestException('userId and workspaceId are required');
        return this.videoService.getLibrary(userId, workspaceId, { tab, sortBy, folder });
    }
    async toggleFavorite(type, id) {
        return this.videoService.toggleFavorite(type, id);
    }
    async moveToTrash(type, id) {
        return this.videoService.moveToTrash(type, id);
    }
    async restoreFromTrash(type, id) {
        return this.videoService.restoreFromTrash(type, id);
    }
    async deletePermanently(type, id) {
        return this.videoService.deletePermanently(type, id);
    }
    async uploadVideo(file, userId, workspaceId, aspectsStr, intent, lang, captions, broll, layoutMode) {
        if (!file)
            throw new common_1.BadRequestException('File is required');
        if (!userId || !workspaceId)
            throw new common_1.BadRequestException('userId and workspaceId are required');
        const videoRecord = await this.videoService.createVideoRecord({
            title: file.originalname,
            url: `http://localhost:3001/uploads/${file.filename}`,
            userId,
            workspaceId
        });
        const aspects = aspectsStr ? aspectsStr.split(',') : undefined;
        this.videoService.processVideo(videoRecord.id, aspects, { intent, lang, captions, broll, layoutMode });
        return {
            success: true,
            message: "Video uploaded successfully",
            video: videoRecord
        };
    }
    async processVideo(id, aspectsStr, intent) {
        const aspects = aspectsStr ? aspectsStr.split(',') : undefined;
        this.videoService.processVideo(id, aspects, { intent });
        return { success: true, message: "Processing started" };
    }
    async importUrl(url, userId, workspaceId, aspectsStr, intent, lang, captions, broll, quality, timeStart, timeEnd, clipLength, layoutMode, topic) {
        if (!url)
            throw new common_1.BadRequestException('url is required');
        if (!userId || !workspaceId)
            throw new common_1.BadRequestException('userId and workspaceId are required');
        const aspects = aspectsStr ? aspectsStr.split(',') : undefined;
        const videoRecord = await this.videoService.importFromUrl(url, userId, workspaceId, aspects, {
            intent, lang, captions, broll, quality, timeStart, timeEnd, clipLength, layoutMode, topic
        });
        return {
            success: true,
            message: "Download started",
            video: videoRecord
        };
    }
    async exportClip(clipId, body) {
        if (!clipId)
            throw new common_1.BadRequestException('clipId is required');
        const result = await this.videoService.exportClip(clipId, body.subtitleConfig, body.reframingMode);
        return result;
    }
    async createCustomClip(videoId, body) {
        if (!videoId || body.startTime == null || body.duration == null) {
            throw new common_1.BadRequestException('videoId, startTime, and duration are required');
        }
        const clip = await this.videoService.createCustomClip(videoId, body.startTime, body.duration);
        return clip;
    }
    async getVideoDetails(id) {
        return this.videoService.getVideoDetails(id);
    }
    async generateBRoll(clipId, body) {
        if (!clipId || !body.keyword)
            throw new common_1.BadRequestException('clipId and keyword are required');
        return this.videoService.generateBRollForClip(clipId, body.keyword, body.duration);
    }
};
exports.VideoController = VideoController;
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('workspaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('library'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('workspaceId')),
    __param(2, (0, common_1.Query)('tab')),
    __param(3, (0, common_1.Query)('sortBy')),
    __param(4, (0, common_1.Query)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getLibrary", null);
__decorate([
    (0, common_1.Post)('favorite/:type/:id'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "toggleFavorite", null);
__decorate([
    (0, common_1.Post)('trash/:type/:id'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "moveToTrash", null);
__decorate([
    (0, common_1.Post)('restore/:type/:id'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "restoreFromTrash", null);
__decorate([
    (0, common_1.Post)('delete/:type/:id'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "deletePermanently", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, `${file.fieldname}-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            }
        })
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('workspaceId')),
    __param(3, (0, common_1.Query)('aspects')),
    __param(4, (0, common_1.Query)('intent')),
    __param(5, (0, common_1.Query)('lang')),
    __param(6, (0, common_1.Query)('captions')),
    __param(7, (0, common_1.Query)('broll')),
    __param(8, (0, common_1.Query)('layoutMode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "uploadVideo", null);
__decorate([
    (0, common_1.Post)('process/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('aspects')),
    __param(2, (0, common_1.Query)('intent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "processVideo", null);
__decorate([
    (0, common_1.Post)('import-url'),
    __param(0, (0, common_1.Query)('url')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Query)('workspaceId')),
    __param(3, (0, common_1.Query)('aspects')),
    __param(4, (0, common_1.Query)('intent')),
    __param(5, (0, common_1.Query)('lang')),
    __param(6, (0, common_1.Query)('captions')),
    __param(7, (0, common_1.Query)('broll')),
    __param(8, (0, common_1.Query)('quality')),
    __param(9, (0, common_1.Query)('timeStart')),
    __param(10, (0, common_1.Query)('timeEnd')),
    __param(11, (0, common_1.Query)('clipLength')),
    __param(12, (0, common_1.Query)('layoutMode')),
    __param(13, (0, common_1.Query)('topic')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "importUrl", null);
__decorate([
    (0, common_1.Post)('clip/:id/export'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "exportClip", null);
__decorate([
    (0, common_1.Post)(':id/clip/custom'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "createCustomClip", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getVideoDetails", null);
__decorate([
    (0, common_1.Post)('clip/:id/broll'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "generateBRoll", null);
exports.VideoController = VideoController = __decorate([
    (0, common_1.Controller)('video'),
    __metadata("design:paramtypes", [video_service_1.VideoService])
], VideoController);
//# sourceMappingURL=video.controller.js.map