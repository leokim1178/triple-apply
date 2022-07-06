import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Review } from 'src/apis/review/entities/review.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Place {
  @ApiProperty({
    example: '9ccf7d9e-6568-4ab1-a1f1-0e63c770d6b4',
    description: 'Primary Key',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '한옥마을 카페',
    description: '여행지 이름',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: '서울',
    description: '여행지가 위치한 지역',
  })
  @Column()
  region: string;

  @ApiProperty({
    example: '대표메뉴 : 아메리카노',
    description: '여행지 상세 설명',
  })
  @Column()
  detail: string;

  @ApiPropertyOptional({
    type: () => [Review],
    example: {
      id: '737fc10f-4a8f-4ac1-8419-8cedab0d61a6',
    },
    isArray: true,
    description: '여행지에 대한 리뷰 목록',
  })
  @OneToMany(() => Review, reviews => reviews.place)
  reviews: Review[];

  @ApiProperty({
    example: '2022-07-06 19:23:15.100208000',
    description: '여행지 생성시간',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2022-07-06 19:23:15.100208000',
    description: '여행지 수정시간',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    example: '2022-07-06 19:23:15.100208000',
    description: '여행지 삭제시간',
  })
  @DeleteDateColumn()
  deletedAt: Date;
}
