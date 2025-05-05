import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Project } from './entities/project.entity';
  import { CreateProjectDto } from './dto/create-project.dto';
  import { UpdateProjectDto } from './dto/update-project.dto';
  
  @Injectable()
  export class ProjectsService {
    constructor(
      @InjectRepository(Project)
      private projectsRepository: Repository<Project>,
    ) {}
  
    async create(createProjectDto: CreateProjectDto, userId: string) {
      const newProject = this.projectsRepository.create({
        ...createProjectDto,
        userId,
      });
  
      return this.projectsRepository.save(newProject);
    }
  
    async findAll(userId: string) {
      return this.projectsRepository.find({
        where: { userId },
        order: { updatedAt: 'DESC' },
      });
    }
  
    async findOne(id: string, userId: string) {
      const project = await this.projectsRepository.findOne({
        where: { id },
      });
  
      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }
  
      if (project.userId !== userId) {
        throw new UnauthorizedException('You do not have access to this project');
      }
  
      return project;
    }
  
    async update(id: string, updateProjectDto: UpdateProjectDto, userId: string) {
      const project = await this.findOne(id, userId);
  
      // Update the project
      Object.assign(project, {
        ...updateProjectDto,
        updatedAt: new Date(),
      });
  
      return this.projectsRepository.save(project);
    }
  
    async remove(id: string, userId: string) {
      const project = await this.findOne(id, userId);
      return this.projectsRepository.remove(project);
    }
  
    async toggleFavorite(id: string, userId: string) {
      const project = await this.findOne(id, userId);
  
      project.isFavorite = !project.isFavorite;
      project.updatedAt = new Date();
  
      return this.projectsRepository.save(project);
    }
  
    async toggleArchive(id: string, userId: string) {
      const project = await this.findOne(id, userId);
  
      project.isArchived = !project.isArchived;
      project.updatedAt = new Date();
  
      return this.projectsRepository.save(project);
    }
  }