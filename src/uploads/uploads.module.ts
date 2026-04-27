// /*
// https://docs.nestjs.com/modules
// */

// import { BadRequestException, Module } from '@nestjs/common';
// import { UploadsController } from './uploads.controller';
// import { MulterModule } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';

// @Module({
//   imports: [
//     MulterModule.register({
//       storage: diskStorage({
//         destination: '../../images',
//         filename: (req, file, callback) => {
//           const uniqueSuffix =
//             Date.now() + '-' + Math.round(Math.random() * 1e9);
//           const filename = `${uniqueSuffix}-${file.originalname}`;
//           callback(null, filename);
//         },
//       }),
//       fileFilter: (req, file, callback) => {
//         if (file.mimetype.startsWith('image')) {
//           callback(null, true);
//         } else {
//           callback(
//             new BadRequestException('Only image files are allowed!'),
//             false,
//           );
//         }
//       },
//       limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//     }),
//   ],
//   controllers: [UploadsController],
//   providers: [],
// })
// export class UploadsModule {}

// uploads/uploads.module.ts
import { BadRequestException, Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as os from 'os';
import * as fs from 'fs';
import { join } from 'path';

// استخدام المجلد المؤقت للنظام
const uploadsDir = join(os.tmpdir(), 'uploads', 'images');

// إنشاء المجلد إذا لم يكن موجوداً
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, uploadsDir);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = `${uniqueSuffix}-${file.originalname}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (file.mimetype.startsWith('image')) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  ],
  controllers: [UploadsController],
  providers: [],
})
export class UploadsModule {}
