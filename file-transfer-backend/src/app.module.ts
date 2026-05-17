import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ShareModule } from './share/share.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { User } from './entities/user.entity';
import { File } from './entities/file.entity';
import { ShareLink } from './entities/share-link.entity';
import { DownloadLog } from './entities/download-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      
      // 1. Prioritize Render's unified connection string if it exists
      url: process.env.DATABASE_URL,
      
      // 2. Fallback to separate variables for your local machine testing
      host: !process.env.DATABASE_URL ? process.env.DB_HOST : undefined,
      port: !process.env.DATABASE_URL ? +(process.env.DB_PORT ?? '5432') : undefined, // PostgreSQL default is 5432
      username: !process.env.DATABASE_URL ? process.env.DB_USERNAME : undefined,
      password: !process.env.DATABASE_URL ? process.env.DB_PASSWORD : undefined,
      database: !process.env.DATABASE_URL ? process.env.DB_NAME : undefined,
      
      entities: [User, File, ShareLink, DownloadLog],
      synchronize: process.env.NODE_ENV !== 'production',
      
      
      // 3. Render's managed PostgreSQL requires SSL connections in production
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    }),
    AuthModule,
    FilesModule,
    ShareModule,
    AnalyticsModule,
  ],
})
export class AppModule {}