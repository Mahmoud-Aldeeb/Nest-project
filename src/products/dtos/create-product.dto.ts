/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  Min,
  Length,
  MinLength,
} from 'class-validator';
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  @ApiProperty()
  title: string;

  @IsString()
  @MinLength(5)
  @ApiProperty()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(0)
  @ApiProperty()
  price: number;
}
