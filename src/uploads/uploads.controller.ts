/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Express, Response } from 'express';
import { ApiConsumes, ApiBody, ApiSecurity } from '@nestjs/swagger';
import { FilesUploadDto } from './dtos/files-upload.dto';

@Controller('/api/uploads')
export class UploadsController {
  // POST: api/uploads
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File upload failed');
    }
    console.log('File uploaded successfully:', file.filename);
    return {
      message: 'File uploaded successfully',
      filename: file.filename,
    };
  }

  // POST: /api/uploads/multiple-files
  @Post('multiple-files')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiSecurity('bearer')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FilesUploadDto,
    description: 'uploading multiple images example',
  })
  uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('File upload failed');
    }
    // console.log('File uploaded successfully:', { files });
    return {
      message: 'Files uploaded successfully',
    };
  }

  @Get(':image')
  showUploadedImage(@Param('image') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: 'images' });
  }
}
