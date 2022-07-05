import { Action, Type } from 'src/apis/pointLog/type/pointLog.type';

import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  content: string; //
  @Column()
  userId: string;
  @Column()
  reviewId: string;
  @Column()
  placeId: string;
  @Column()
  attachedPhotoIds: string;
  @Column()
  type: Type;
  @Column()
  action: Action;

  @CreateDateColumn()
  createdAt: Date;
}
