import { Controller, Post, Get, Delete, Param, Body, UseGuards, Request, Ip } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShareService } from './share.service';

@Controller('share')
export class ShareController {
  constructor(private shareService: ShareService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createLink(
    @Body() body: { fileId: number; password?: string; expiresIn?: number; maxDownloads?: number },
    @Request() req,
  ) {
    return this.shareService.createShareLink(body.fileId, req.user.id, {
      password: body.password,
      expiresIn: body.expiresIn,
      maxDownloads: body.maxDownloads,
    });
  }

  @Get('my-links')
  @UseGuards(AuthGuard('jwt'))
  getMyLinks(@Request() req) {
    return this.shareService.getUserLinks(req.user.id);
  }

  @Get(':token')
  accessLink(@Param('token') token: string) {
    return this.shareService.accessLink(token);
  }

  @Post(':token/download')
  downloadFile(
    @Param('token') token: string,
    @Body() body: { password?: string },
    @Ip() ip: string,
  ) {
    return this.shareService.verifyAndDownload(token, body.password, ip);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deactivate(@Param('id') id: number, @Request() req) {
    return this.shareService.deactivateLink(id, req.user.id);
  }
}