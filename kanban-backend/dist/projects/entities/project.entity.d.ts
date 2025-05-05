import { User } from '../../auth/entities/user.entity';
export declare class Project {
    id: string;
    name: string;
    description: string;
    isFavorite: boolean;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    userId: string;
}
