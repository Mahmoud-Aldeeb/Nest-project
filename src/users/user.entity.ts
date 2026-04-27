import { Product } from '../products/product.entity';
import { Review } from '../reviews/review.entity';
import { CURRENT_TIMESTAMP } from '../utils/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserType } from '../utils/enums';
import { Exclude } from 'class-transformer';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', length: '150', nullable: true })
  username: string;

  @Column({ type: 'varchar', length: '250', unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.NORMAL_USER })
  userType: UserType;

  @Column({ default: false })
  isAccountVerified: Boolean;

  @Column({ name: 'verificationToken', nullable: true, type: 'text' })
  verificationToken: string | null;

  @Column({ nullable: true, type: 'text' })
  resetPasswordToken: string | null;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @Column({ nullable: true, default: null })
  profileImage: string;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Review, (review) => review.user)
  review: Review[];
}
