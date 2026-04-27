/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { updateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';
import { AuthRolesGuard } from '../users/guards/auth-roles.guard';
import { Roles } from '../users/decorators/user-role.decorator';
import { UserType } from '../utils/enums';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import * as types from '../utils/types';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('/api/products/')
export class ProductController {
  constructor(private readonly productsService: ProductsService) {}

  // test express
  // @Post('express-way')
  // createNewProductExpressWay(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Headers() headers: any,
  // ) {
  //   const newProduct: ProductType = {
  //     id: this.products.length + 1,
  //     title: req.body.title,
  //     price: req.body.price,
  //   };
  //   this.products.push(newProduct);
  //   console.log(headers);
  //   res.status(201).json(newProduct);
  // }

  @Post()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  @ApiSecurity('bearer')
  createNewProduct(
    @Body() body: CreateProductDto,
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    return this.productsService.createProduct(body, payload.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get a collection of products' })
  @ApiResponse({ status: 200, description: 'products fetched successfully' })
  @ApiQuery({
    name: 'title',
    required: false,
    type: 'string',
    description: 'search based on product title',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: 'number',
    description: 'search based on product main price',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: 'number',
    description: 'search based on product max price',
  })
  public getAllProducts(
    @Query('title') title: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.productsService.getAll(title, minPrice, maxPrice);
  }

  @Get(':id')
  // @SkipThrottle()
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  public getSingleProducts(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getOneBy(id);
  }

  @Put(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  @ApiSecurity('bearer')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: updateProductDto,
  ) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  @ApiSecurity('bearer')
  deleteProducts(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }
}
