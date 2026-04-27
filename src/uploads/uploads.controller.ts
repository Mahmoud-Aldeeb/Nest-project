// /*
// https://docs.nestjs.com/controllers#controllers
// */

// import {
//   BadRequestException,
//   Controller,
//   Get,
//   Param,
//   Post,
//   Res,
//   UploadedFile,
//   UploadedFiles,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
// import type { Express, Response } from 'express';
// import { ApiConsumes, ApiBody, ApiSecurity } from '@nestjs/swagger';
// import { FilesUploadDto } from './dtos/files-upload.dto';

// @Controller('/api/uploads')
// export class UploadsController {
//   // POST: api/uploads
//   @Post()
//   @UseInterceptors(FileInterceptor('file'))
//   uploadFile(@UploadedFile() file: Express.Multer.File) {
//     if (!file) {
//       throw new Error('File upload failed');
//     }
//     console.log('File uploaded successfully:', file.filename);
//     return {
//       message: 'File uploaded successfully',
//       filename: file.filename,
//     };
//   }

//   // POST: /api/uploads/multiple-files
//   @Post('multiple-files')
//   @UseInterceptors(FilesInterceptor('files'))
//   @ApiSecurity('bearer')
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     type: FilesUploadDto,
//     description: 'uploading multiple images example',
//   })
//   uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
//     if (!files || files.length === 0) {
//       throw new BadRequestException('File upload failed');
//     }
//     // console.log('File uploaded successfully:', { files });
//     return {
//       message: 'Files uploaded successfully',
//     };
//   }

//   @Get(':image')
//   showUploadedImage(@Param('image') image: string, @Res() res: Response) {
//     return res.sendFile(image, { root: 'images' });
//   }
// }

// uploads/uploads.controller.ts
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
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('/api/uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File upload failed');
    }

    console.log('File uploaded successfully:', file.originalname);
    console.log('File size:', file.size);
    console.log('MIME type:', file.mimetype);

    // file.buffer يحتوي على بيانات الصورة (يمكن تخزينها في قاعدة البيانات)

    return {
      message: 'File uploaded successfully',
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  @Post('multiple-files')
  @UseInterceptors(FilesInterceptor('files'))
  uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    return {
      message: 'Files uploaded successfully',
      count: files.length,
      files: files.map((f) => ({
        filename: f.originalname,
        size: f.size,
        mimetype: f.mimetype,
      })),
    };
  }
}
