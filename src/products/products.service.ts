/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { updateProductDto } from './dtos/update-product.dto';
import { UsersService } from '../users/users.service';
import { Between, Like, Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly usersService: UsersService,
  ) {}

  // test express

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

  /**
   * Create new product
   * @param dto  data for creating new product
   * @param userId id of the logged in user (Admin)
   * @returns the created product from the database
   */
  async createProduct(dto: CreateProductDto, userId: number) {
    const user = await this.usersService.getCurrentUser(userId);
    const newProduct = this.productsRepository.create({
      ...dto,
      title: dto.title.toLowerCase(),
      user,
    });
    return this.productsRepository.save(newProduct);
  }

  /**
   * Get all products
   * @returns collection of products
   */
  public async getAll(title?: string, minPrice?: number, maxPrice?: number) {
    const filters = {
      ...(title && { title: Like(`%${title.toLowerCase()}%`) }),
      ...(minPrice && maxPrice ? { price: Between(minPrice, maxPrice) } : {}),
    };

    return this.productsRepository.find({ where: filters });
  }

  /**
   * Get one product by id
   * @param id id of the product
   * @returns product from the database
   */
  async getOneBy(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });
    if (!product) throw new NotFoundException('product not fount');
    return product;
  }

  /**
   * update product
   *@param id id of the product
   * @param dto data for updating the exsiting product
   * @returns the updated product from the database
   */
  async update(id: number, dto: updateProductDto) {
    const product = (await this.getOneBy(id)) || null;
    product.title = dto.title ?? product.title;
    product.description = dto.description ?? product.description;
    product.price = dto.price ?? product?.price;
    return this.productsRepository.save(product);
  }

  /**
   * Delete product
   *@param id id of the product
   * @returns message of successful deletion
   */
  async delete(id: number) {
    const product = await this.getOneBy(id);
    await this.productsRepository.remove(product);
    return { message: 'product deleted successfully' };
  }
}
