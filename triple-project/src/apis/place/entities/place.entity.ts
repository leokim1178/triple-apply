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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  region: string;

  @Column()
  location: string;

  @Column()
  detail: string;

  @OneToMany(() => Review, reviews => reviews.place)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
