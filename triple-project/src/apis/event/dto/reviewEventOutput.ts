import { PointLog } from 'src/apis/pointLog/entities/pointLog.entity';
import { Event } from '../entites/event.entity';

export class ReviewEventOutput {
  eventLog: Event;
  pointLog: PointLog;
}
