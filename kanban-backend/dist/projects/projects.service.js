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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("./entities/project.entity");
let ProjectsService = class ProjectsService {
    projectsRepository;
    constructor(projectsRepository) {
        this.projectsRepository = projectsRepository;
    }
    async create(createProjectDto, userId) {
        const newProject = this.projectsRepository.create({
            ...createProjectDto,
            userId,
        });
        return this.projectsRepository.save(newProject);
    }
    async findAll(userId) {
        return this.projectsRepository.find({
            where: { userId },
            order: { updatedAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const project = await this.projectsRepository.findOne({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        if (project.userId !== userId) {
            throw new common_1.UnauthorizedException('You do not have access to this project');
        }
        return project;
    }
    async update(id, updateProjectDto, userId) {
        const project = await this.findOne(id, userId);
        Object.assign(project, {
            ...updateProjectDto,
            updatedAt: new Date(),
        });
        return this.projectsRepository.save(project);
    }
    async remove(id, userId) {
        const project = await this.findOne(id, userId);
        return this.projectsRepository.remove(project);
    }
    async toggleFavorite(id, userId) {
        const project = await this.findOne(id, userId);
        project.isFavorite = !project.isFavorite;
        project.updatedAt = new Date();
        return this.projectsRepository.save(project);
    }
    async toggleArchive(id, userId) {
        const project = await this.findOne(id, userId);
        project.isArchived = !project.isArchived;
        project.updatedAt = new Date();
        return this.projectsRepository.save(project);
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map