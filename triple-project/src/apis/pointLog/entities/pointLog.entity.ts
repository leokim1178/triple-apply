import { User } from 'src/apis/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Action, Type } from '../type/pointLog.type';

@Entity()
export class PointLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  point: number;

  @Column({ default: 0 })
  total: number;

  @Column()
  type: Type;

  @Column()
  action: Action;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
