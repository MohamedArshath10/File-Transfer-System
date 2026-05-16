import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../entities/file.entity';
import { ShareLink } from '../entities/share-link.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(File) private fileRepo: Repository<File>,
    @InjectRepository(ShareLink) private shareLinkRepo: Repository<ShareLink>,
  ) {}

  async getStats(userId: number) {
    const totalFiles = await this.fileRepo.count({ where: { user: { id: userId } } });
    const files = await this.fileRepo.find({ where: { user: { id: userId } } });
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    const links = await this.shareLinkRepo.find({
      where: { file: { user: { id: userId } } },
      relations: ['file'],
    });
    const totalLinks = links.length;
    const activeLinks = links.filter(l => l.is_active).length;
    const totalDownloads = links.reduce((acc, l) => acc + l.download_count, 0);

    return { totalFiles, totalSize, totalLinks, activeLinks, totalDownloads };
  }
}