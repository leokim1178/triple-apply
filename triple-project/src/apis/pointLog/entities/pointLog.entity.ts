import { Review } from 'src/apis/review/entities/review.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Action, Type } from '../type/pointLog.type';

@Entity()
export class PointLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  point: number;

  @Column()
  total: number;

  @Column()
  type: Type;

  @Column()
  action: Action;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Review)
  review: Review;

  @CreateDateColumn()
  createdAt: Date;
}
