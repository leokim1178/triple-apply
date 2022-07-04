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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'longtext', nullable: true })
  content: string;

  @ManyToOne(() => Place)
  place: Place;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => ReviewImage, images => images.review, { cascade: true, nullable: true })
  reviewImages: ReviewImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
