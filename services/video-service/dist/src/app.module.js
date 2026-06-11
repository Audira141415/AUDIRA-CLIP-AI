"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const video_controller_1 = require("./video.controller");
const video_service_1 = require("./video.service");
const project_controller_1 = require("./project.controller");
const project_service_1 = require("./project.service");
const ollama_service_1 = require("./ollama.service");
const transcription_service_1 = require("./transcription.service");
const heatmap_service_1 = require("./heatmap.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
        ],
        controllers: [app_controller_1.AppController, video_controller_1.VideoController, project_controller_1.ProjectController],
        providers: [app_service_1.AppService, video_service_1.VideoService, project_service_1.ProjectService, ollama_service_1.OllamaService, transcription_service_1.TranscriptionService, heatmap_service_1.HeatmapService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map