import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Action, Type } from '../type/pointLog.type';

@Entity()
export class PointLog {
  @ApiProperty({
    description: 'Primary Key',
    example: '9ccf7d9e-6568-4ab1-a1f1-0e63c770d6b4',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '변경된 포인트 수', example: 2 })
  @Column()
  point: number;

  @ApiProperty({ description: '유저가 지금까지 보유한 포인트양', example: 15 })
  @Column({ default: 0 })
  total: number;

  @ApiProperty({ description: '이벤트 주제', example: 'REVIEW', enum: Type })
  @Column()
  type: Type;

  @ApiProperty({ description: '이벤트 내용', example: 'ADD', enum: Action })
  @Column()
  action: Action;

  @ApiPropertyOptional({
    type: () => User,
    description: '이벤트를 발생시킨 유저 Id(uuid)',
    example: '8da0c653-167d-472c-83d4-c09fa674bc60',
  })
  @ManyToOne(() => User)
  user: User;

  @ApiProperty({
    example: '2022-07-06 19:23:15.100208000',
    description: '포인트 기록 생성시간',
  })
  @CreateDateColumn()
  createdAt: Date;
}
