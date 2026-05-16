import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { File } from '../entities/file.entity';
import { ShareLink } from '../entities/share-link.entity';
import { DownloadLog } from '../entities/download-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File, ShareLink, DownloadLog])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}