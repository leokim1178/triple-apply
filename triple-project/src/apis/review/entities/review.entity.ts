import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Place } from 'src/apis/place/entities/place.entity';
import { ReviewImage } from 'src/apis/reviewImage/entities/reviewImage.entity';
import { User } from 'src/apis/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Review {
  @ApiProperty({
    example: '9ccf7d9e-6568-4ab1-a1f1-0e63c770d6b4',
    description: 'Primary Key',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '리뷰 내용', example: '오늘 가봤는데 너무 좋아요!' })
  @Column({ type: 'longtext' })
  content: string;

  @ApiPropertyOptional({
    type: () => Place,
    description: '리뷰가 작성된 여행지 Id(uuid)',
    example: '1eeadb33-350e-4c51-8ef0-7e8667bd181c',
  })
  @ManyToOne(() => Place)
  place: Place;

  @ApiPropertyOptional({
    type: () => User,
    description: '리뷰의 작성자 Id(uuid)',
    example: '8da0c653-167d-472c-83d4-c09fa674bc60',
  })
  @ManyToOne(() => User)
  user: User;

  @ApiProperty({ description: '리뷰에 할당된 기본 포인트', example: 1 })
  @Column({ default: 1 })
  defaultPoint: number;

  @ApiProperty({ description: '리뷰에 할당된 이미지 포인트', example: 1 })
  @Column()
  imagePoint: number;

  @ApiProperty({ description: '리뷰에 해당된 보너스 포인트', example: 1 })
  @Column()
  bonusPoint: number;

  @ApiPropertyOptional({
    type: () => [ReviewImage],
    example: {
      id: 'beeb6529-b7c2-41a6-af92-7a14891714be',
    },
    isArray: true,
    description: '리뷰에 첨부된 이미지 목록',
  })
  @OneToMany(() => ReviewImage, images => images.review, { cascade: true, nullable: true })
  reviewImages?: ReviewImage[];

  @ApiProperty({
    example: '2022-07-06 19:23:15.100208000',
    description: '리뷰 생성시간',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2022-07-06 19:23:15.100208000',
    description: '리뷰 수정시간',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    example: '2022-07-06 19:23:15.100208000',
    description: '리뷰 삭제시간',
  })
  @DeleteDateColumn()
  deletedAt: Date;
}
