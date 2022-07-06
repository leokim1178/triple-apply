import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Place } from 'src/apis/place/entities/place.entity';
import { Review } from 'src/apis/review/entities/review.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ReviewImage {
  @ApiProperty({
    example: '9ccf7d9e-6568-4ab1-a1f1-0e63c770d6b4',
    description: 'Primary Key',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @ApiPropertyOptional({
    type: () => Review,
    description: '이 이미지가 첨부된 리뷰 Id(uuid)',
    example: '1eeadb33-350e-4c51-8ef0-7e8667bd181c',
  })
  @ManyToOne(() => Review, { onDelete: 'CASCADE' })
  review: Review;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
