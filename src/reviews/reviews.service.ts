/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/*
https://docs.nestjs.com/providers#services
*/

import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { UpdateReviewDto } from './dtos/updatereview.dto';
import { JWTPayloadType } from 'src/utils/types';
import { UserType } from 'src/utils/enums';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * create new review
   * @param productId id of the product
   * @param userId id of the user that created this review
   * @param dto data for creating new review
   * @returns the created review from the database
   */
  async createReview(productId: number, userId: number, dto: CreateReviewDto) {
    const product = await this.productsService.getOneBy(productId);
    const user = await this.usersService.getCurrentUser(userId);
    const review = this.reviewRepository.create({ ...dto, product, user });
    const result = await this.reviewRepository.save(review);
    return {
      id: result.id,
      rating: result.rating,
      comment: result.comment,
      createAt: result.createAt,
      userId: user.id,
      productId: product.id,
    };
  }

  /**
   * Get all reviews, sorted by createAt in descending order
   * @param pageNumber page number for pagination
   * @param reviewPerPage number of reviews per page
   * @returns collection of reviews
   */
  async getAllReviews(pageNumber: number, reviewPerPage: number) {
    return await this.reviewRepository.find({
      skip: reviewPerPage * (pageNumber - 1),
      take: reviewPerPage,
      order: { createAt: 'DESC' },
    });
  }

  /**
   * Get one review by id
   * @param id id of the review
   * @returns
   */
  async getOneBy(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });
    if (!review) {
      throw new Error('Review not found');
    }
    return review;
  }

  /**
   * update review by id, only the user who created this review can update it
   * @param reviewId id of the review
   * @param userId id of the user that created this review
   * @param dto data for updating the review
   * @returns the updated review from the database
   */
  async UpdateReview(reviewId: number, userId: number, dto: UpdateReviewDto) {
    const review = await this.getOneBy(reviewId);
    if (review.user.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this review',
      );
    }
    review.rating = dto.rating ?? review.rating;
    review.comment = dto.comment ?? review.comment;
    return await this.reviewRepository.save(review);
  }

  /**
   * Delete review
   * @param reviewId id of the review
   * @param payload JWTPayload
   * @returns a success message if the review is deleted successfully
   * @throws ForbiddenException if the user is not authorized to delete this review
   * Only the user who created this review or admin can delete it
   */
  async deleteReview(reviewId: number, payload: JWTPayloadType) {
    const review = await this.getOneBy(reviewId);
    if (review.user.id === payload.id || payload.userType === UserType.ADMIN) {
      await this.reviewRepository.delete(reviewId);
      return { message: 'Review deleted successfully' };
    }
    throw new ForbiddenException(
      'You are not authorized to delete this review',
    );
  }
}
