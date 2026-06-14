import { ProjectService } from './project.service';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    createProject(body: {
        name: string;
        userId: string;
        workspaceId: string;
        clipIds: string[];
    }): Promise<{
        success: boolean;
        project: {
            clips: ({
                clip: {
                    id: string;
                    title: string;
                    url: string;
                    duration: number;
                    folder: string | null;
                    isFavorite: boolean;
                    isDeleted: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    videoId: string;
                    thumbnailUrl: string | null;
                    startTime: number;
                    score: number | null;
                    reason: string | null;
                    socialCaption: string | null;
                    hashtags: string | null;
                    wpm: number | null;
                    pacing: string | null;
                    brollKeyword: string | null;
                    vibe: string | null;
                    hookStrength: string | null;
                    retentionRisk: string | null;
                    targetDemographic: string | null;
                    bgmSuggestion: string | null;
                    alternativeTitle: string | null;
                    brandSafety: string | null;
                    ctaOverlay: string | null;
                    aspectRatio: string;
                    platform: string;
                };
            } & {
                id: string;
                order: number;
                clipId: string;
                projectId: string;
            })[];
        } & {
            id: string;
            status: string;
            userId: string;
            workspaceId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        };
    }>;
    getProject(id: string): Promise<{
        clips: ({
            clip: {
                id: string;
                title: string;
                url: string;
                duration: number;
                folder: string | null;
                isFavorite: boolean;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
                videoId: string;
                thumbnailUrl: string | null;
                startTime: number;
                score: number | null;
                reason: string | null;
                socialCaption: string | null;
                hashtags: string | null;
                wpm: number | null;
                pacing: string | null;
                brollKeyword: string | null;
                vibe: string | null;
                hookStrength: string | null;
                retentionRisk: string | null;
                targetDemographic: string | null;
                bgmSuggestion: string | null;
                alternativeTitle: string | null;
                brandSafety: string | null;
                ctaOverlay: string | null;
                aspectRatio: string;
                platform: string;
            };
        } & {
            id: string;
            order: number;
            clipId: string;
            projectId: string;
        })[];
    } & {
        id: string;
        status: string;
        userId: string;
        workspaceId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    }>;
    listProjects(userId: string, workspaceId: string): Promise<({
        clips: ({
            clip: {
                id: string;
                title: string;
                url: string;
                duration: number;
                folder: string | null;
                isFavorite: boolean;
                isDeleted: boolean;
                createdAt: Date;
                updatedAt: Date;
                videoId: string;
                thumbnailUrl: string | null;
                startTime: number;
                score: number | null;
                reason: string | null;
                socialCaption: string | null;
                hashtags: string | null;
                wpm: number | null;
                pacing: string | null;
                brollKeyword: string | null;
                vibe: string | null;
                hookStrength: string | null;
                retentionRisk: string | null;
                targetDemographic: string | null;
                bgmSuggestion: string | null;
                alternativeTitle: string | null;
                brandSafety: string | null;
                ctaOverlay: string | null;
                aspectRatio: string;
                platform: string;
            };
        } & {
            id: string;
            order: number;
            clipId: string;
            projectId: string;
        })[];
    } & {
        id: string;
        status: string;
        userId: string;
        workspaceId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
    })[]>;
}
