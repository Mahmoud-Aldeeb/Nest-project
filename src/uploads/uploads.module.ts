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
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigModule, ConfigService } from '@nestjs/config';

// تكوين Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // في الإنتاج استخدم Cloudinary، في التطوير استخدم مجلد محلي
        if (process.env.NODE_ENV === 'production') {
          const storage = new CloudinaryStorage({
            cloudinary: cloudinary,
            params: {
              folder: 'user_images',
              format: async (req, file) => 'jpg',
              public_id: (req, file) => `${Date.now()}-${file.originalname}`,
            },
          });

          return {
            storage,
            limits: { fileSize: 5 * 1024 * 1024 },
          };
        } else {
          // التطوير: استخدام مجلد محلي
          const fs = require('fs');
          const path = require('path');
          const uploadsDir = path.join(process.cwd(), 'images');

          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }

          return {
            storage: diskStorage({
              destination: uploadsDir,
              filename: (req, file, callback) => {
                const uniqueSuffix =
                  Date.now() + '-' + Math.round(Math.random() * 1e9);
                callback(null, `${uniqueSuffix}-${file.originalname}`);
              },
            }),
            limits: { fileSize: 5 * 1024 * 1024 },
          };
        }
      },
    }),
  ],
  controllers: [UploadsController],
  providers: [],
})
export class UploadsModule {}
