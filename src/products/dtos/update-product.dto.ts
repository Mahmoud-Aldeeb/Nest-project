/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Length,
  IsOptional,
  MinLength,
} from 'class-validator';

export class updateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 150)
  @IsOptional()
  @ApiPropertyOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @ApiPropertyOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional()
  price?: number;
}
