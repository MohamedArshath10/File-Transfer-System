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
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, File, ShareLink, DownloadLog],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    FilesModule,
    ShareModule,
    AnalyticsModule,
  ],
})
export class AppModule {}