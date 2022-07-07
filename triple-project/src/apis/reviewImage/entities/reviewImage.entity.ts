import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Review } from 'src/apis/review/entities/review.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReviewImage {
  @ApiProperty({
    example: '9ccf7d9e-6568-4ab1-a1f1-0e63c770d6b4',
    description: 'Primary Key',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'photo1.png',
    description: '리뷰에 첨부된 이미지의 url',
  })
  @Column()
  url: string;

  @ApiPropertyOptional({
    type: () => Review,
    description: '이 이미지가 첨부된 리뷰 Id(uuid)',
    example: '1eeadb33-350e-4c51-8ef0-7e8667bd181c',
  })
  @ManyToOne(() => Review, { onDelete: 'CASCADE' })
  review: Review;

  @ApiProperty({
    example: '2022-07-06 19:23:15.100208000',
    description: '리뷰 이미지 생성시간',
  })
  @CreateDateColumn()
  createdAt: Date;
}
