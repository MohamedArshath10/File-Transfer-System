import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { File } from '../entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private fileRepo: Repository<File>,
  ) {}

  async uploadFile(userId: number, file: Express.Multer.File) {
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'file-sharing', resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      ).end(file.buffer);
    });

    const newFile = this.fileRepo.create({
      user: { id: userId },
      original_name: file.originalname,
      cloudinary_url: result.secure_url,
      cloudinary_public_id: result.public_id,
      size: file.size,
      mime_type: file.mimetype,
    });

    return this.fileRepo.save(newFile);
  }

  async getUserFiles(userId: number) {
    return this.fileRepo.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  async deleteFile(fileId: number, userId: number) {
    const file = await this.fileRepo.findOne({
      where: { id: fileId, user: { id: userId } },
    });
    if (!file) throw new Error('File not found');
    await cloudinary.uploader.destroy(file.cloudinary_public_id);
    await this.fileRepo.remove(file);
    return { message: 'File deleted' };
  }
}