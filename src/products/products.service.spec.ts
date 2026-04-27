import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { beforeEach } from 'node:test';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';

describe('ProductsService', () => {
  let productsService: ProductsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: UsersService,
          useValue: {},
        },
        { provide: getRepositoryToken(Product), useValue: {} },
      ],
    }).compile();
    productsService = module.get<ProductsService>(ProductsService);
  });
  it('should product service be defined', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/unbound-method
    expect(productsService).toBeDefined;
  });
});
