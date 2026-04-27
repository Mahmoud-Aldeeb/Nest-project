import { MailModule } from './mail/mail.module';
import { UploadsController } from './uploads/uploads.controller';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';
import { Review } from './reviews/review.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import helmet from 'helmet';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { dataSourceOptions } from '../db/data-source';

@Module({
  imports: [
    MailModule,
    UploadsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV !== 'production'
          ? `.env.${process.env.NODE_ENV}`
          : '.env',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 4000,
        limit: 3,
      },
      {
        name: 'meduim',
        ttl: 10000,
        limit: 7,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 15,
      },
    ]),
    TypeOrmModule.forRoot(dataSourceOptions),

    UsersModule,
    ReviewsModule,
    ProductsModule,
  ],
  controllers: [UploadsController, AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet()).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}

// Local Database

// {
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => {
//         return {
//           type: 'postgres',
//           database: config.get<string>('DB_DATABASE'),
//           username: config.get<string>('DB_USERNAME'),
//           password: config.get<string>('DB_PASSWORD'),
//           port: config.get<number>('DB_PORT'),
//           host: 'localhost',
//           synchronize: process.env.NODE_ENV !== 'production',
//           entities: [Product, User, Review],
//         };
//       },
//     }
