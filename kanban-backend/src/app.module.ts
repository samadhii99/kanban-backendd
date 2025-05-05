import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { User } from './auth/entities/user.entity';
import { Project } from './projects/entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // You can use any database you prefer
      database: 'database.sqlite',
      entities: [User, Project],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    ProjectsModule,
  ],
})
export class AppModule {}
