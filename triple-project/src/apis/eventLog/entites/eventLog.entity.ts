import { Action, Type } from 'src/apis/pointLog/type/pointLog.type';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventLog {
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
}
