import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { ShareLink } from '../entities/share-link.entity';
import { DownloadLog } from '../entities/download-log.entity';
import { File } from '../entities/file.entity';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(ShareLink) private shareLinkRepo: Repository<ShareLink>,
    @InjectRepository(DownloadLog) private downloadLogRepo: Repository<DownloadLog>,
    @InjectRepository(File) private fileRepo: Repository<File>,
  ) {}

  async createShareLink(fileId: number, userId: number, options: {
    password?: string; expiresIn?: number; maxDownloads?: number;
  }) {
    const file = await this.fileRepo.findOne({
      where: { id: fileId, user: { id: userId } },
    });
    if (!file) throw new NotFoundException('File not found');

    const token = nanoid(12);
    const hashedPassword = options.password ? await bcrypt.hash(options.password, 10) : null;
    const expiresAt = options.expiresIn
      ? new Date(Date.now() + options.expiresIn * 60 * 60 * 1000)
      : null;

    const link = this.shareLinkRepo.create({
      file,
      token,
      password: hashedPassword,
      expires_at: expiresAt,
      max_downloads: options.maxDownloads || null,
    });

    return this.shareLinkRepo.save(link);
  }

  async accessLink(token: string) {
    const link = await this.shareLinkRepo.findOne({
      where: { token },
      relations: ['file'],
    });
    if (!link || !link.is_active) throw new NotFoundException('Link not found or inactive');
    if (link.expires_at && new Date() > link.expires_at) throw new ForbiddenException('Link has expired');
    if (link.max_downloads && link.download_count >= link.max_downloads) throw new ForbiddenException('Download limit reached');

    return {
      fileName: link.file.original_name,
      fileSize: link.file.size,
      mimeType: link.file.mime_type,
      hasPassword: !!link.password,
      expiresAt: link.expires_at,
      downloadCount: link.download_count,
      maxDownloads: link.max_downloads,
    };
  }

  async verifyAndDownload(token: string, password: string, ip: string) {
    const link = await this.shareLinkRepo.findOne({
      where: { token },
      relations: ['file'],
    });
    if (!link || !link.is_active) throw new NotFoundException('Link not found');
    if (link.expires_at && new Date() > link.expires_at) throw new ForbiddenException('Link expired');
    if (link.max_downloads && link.download_count >= link.max_downloads) throw new ForbiddenException('Download limit reached');

    if (link.password) {
      const match = await bcrypt.compare(password || '', link.password);
      if (!match) throw new ForbiddenException('Invalid password');
    }

    link.download_count += 1;
    await this.shareLinkRepo.save(link);

    const log = this.downloadLogRepo.create({ shareLink: link, ip_address: ip });
    await this.downloadLogRepo.save(log);

    return { downloadUrl: link.file.cloudinary_url, fileName: link.file.original_name };
  }

  async getUserLinks(userId: number) {
    return this.shareLinkRepo.find({
      where: { file: { user: { id: userId } } },
      relations: ['file'],
      order: { created_at: 'DESC' },
    });
  }

  async deactivateLink(linkId: number, userId: number) {
    const link = await this.shareLinkRepo.findOne({
      where: { id: linkId, file: { user: { id: userId } } },
      relations: ['file'],
    });
    if (!link) throw new NotFoundException('Link not found');
    link.is_active = false;
    await this.shareLinkRepo.save(link);
    return { message: 'Link deactivated' };
  }
}