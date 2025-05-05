import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsService {
    private projectsRepository;
    constructor(projectsRepository: Repository<Project>);
    create(createProjectDto: CreateProjectDto, userId: string): Promise<Project>;
    findAll(userId: string): Promise<Project[]>;
    findOne(id: string, userId: string): Promise<Project>;
    update(id: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<Project>;
    remove(id: string, userId: string): Promise<Project>;
    toggleFavorite(id: string, userId: string): Promise<Project>;
    toggleArchive(id: string, userId: string): Promise<Project>;
}
