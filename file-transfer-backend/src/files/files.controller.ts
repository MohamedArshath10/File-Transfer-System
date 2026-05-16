import { Controller, Post, Get, Delete, Param, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';
import 'multer';

@Controller('files')
@UseGuards(AuthGuard('jwt'))
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: undefined }))
  upload(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.filesService.uploadFile(req.user.id, file);
  }

  @Get()
  getFiles(@Request() req) {
    return this.filesService.getUserFiles(req.user.id);
  }

  @Delete(':id')
  deleteFile(@Param('id') id: number, @Request() req) {
    return this.filesService.deleteFile(id, req.user.id);
  }
}