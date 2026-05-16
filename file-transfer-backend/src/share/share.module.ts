import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';
import { ShareLink } from '../entities/share-link.entity';
import { DownloadLog } from '../entities/download-log.entity';
import { File } from '../entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShareLink, DownloadLog, File])],
  controllers: [ShareController],
  providers: [ShareService],
})
export class ShareModule {}