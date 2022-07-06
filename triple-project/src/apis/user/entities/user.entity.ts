import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PointLog } from 'src/apis/pointLog/entities/pointLog.entity';
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
export class User {
  @ApiProperty({
    example: '9ccf7d9e-6568-4ab1-a1f1-0e63c770d6b4',
    description: 'Primary Key',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'leo3179@gmail.com',
    description: '이메일 주소',
  })
  @Column()
  email: string;

  @ApiProperty({
    example: '1234',
    description: '비밀번호',
  })
  @Column()
  password: string;

  @ApiProperty({
    default: 0,
    description: '유저 포인트',
  })
  @Column({ default: 0 })
  point: number;

  @ApiProperty({
    example: '대전 거주 중인 김태영이라고 합니다',
    description: '유저 정보',
  })
  @Column({ type: 'longtext' })
  information: string;

  @ApiPropertyOptional({
    type: () => [PointLog],
    example: {
      id: '24517b41-da36-49e3-9df6-54556da23315',
      point: 2,
      total: 15,
      type: 'ADD',
      action: 'REVIEW',
      user: '9ccf7d9e-6568-4ab1-a1f1-0e63c770d6b4',
      createdAt: '2022-07-06 19:23:15.100208000',
    },
    description: '유저 포인트 기록',
  })
  @OneToMany(() => PointLog, pointLog => pointLog.user, { nullable: true, cascade: true })
  pointLogs: PointLog[];

  @ApiProperty({
    example: '2022-07-06 19:23:15.100208000',
    description: '유저 생성시간',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2022-07-06 19:23:15.100208000',
    description: '유저 수정시간',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    example: '2022-07-06 19:23:15.100208000',
    description: '유저 삭제시간',
  })
  @DeleteDateColumn()
  deletedAt: Date;
}
