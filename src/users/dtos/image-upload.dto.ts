import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';

type NewType = Express.Multer.File;

export class ImageUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    name: 'user-image',
  })
  file: NewType;
}
