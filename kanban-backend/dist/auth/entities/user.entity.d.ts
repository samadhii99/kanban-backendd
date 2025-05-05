import { Project } from '../../projects/entities/project.entity';
export declare class User {
    id: string;
    fullName: string;
    email: string;
    password: string;
    projects: Project[];
}
