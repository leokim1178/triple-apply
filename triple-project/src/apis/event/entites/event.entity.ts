import { ApiProperty } from '@nestjs/swagger';
import { Action, Type } from 'src/apis/event/type/event.type';

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @ApiProperty({
    example: '9ccf7d9e-6568-4ab1-a1f1-0e63c770d6b4',
    description: 'Primary Key',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '리뷰 내용', example: '오늘 가봤는데 너무 좋아요!' })
  @Column()
  content: string; //

  @ApiProperty({ description: '리뷰의 작성자 Id(uuid)', example: 'uuid' })
  @Column()
  userId: string;

  @ApiProperty({ description: '리뷰 Id(uuid)', example: 'uuid' })
  @Column()
  reviewId: string;

  @ApiProperty({ description: '리뷰가 작성된 장소 Id(uuid)', example: 'uuid' })
  @Column()
  placeId: string;

  @ApiProperty({ description: '이벤트 주제', example: 'REVIEW', enum: Type })
  @Column()
  type: Type;

  @ApiProperty({ description: '이벤트 내용', example: 'ADD', enum: Action })
  @Column()
  action: Action;

  @ApiProperty({
    description: '리뷰에 첨부된 이미지 Id(uuid) 배열',
    isArray: true,
    nullable: true,
    example: ['uuid1', 'uuid2'],
  })
  @Column({ nullable: true })
  attachedPhotoIds: string;

  @CreateDateColumn()
  createdAt: Date;
}
