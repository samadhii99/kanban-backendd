import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto, req: any): Promise<import("./entities/project.entity").Project>;
    findAll(req: any): Promise<import("./entities/project.entity").Project[]>;
    findOne(id: string, req: any): Promise<import("./entities/project.entity").Project>;
    update(id: string, updateProjectDto: UpdateProjectDto, req: any): Promise<import("./entities/project.entity").Project>;
    remove(id: string, req: any): Promise<import("./entities/project.entity").Project>;
    toggleFavorite(id: string, req: any): Promise<import("./entities/project.entity").Project>;
    toggleArchive(id: string, req: any): Promise<import("./entities/project.entity").Project>;
}
