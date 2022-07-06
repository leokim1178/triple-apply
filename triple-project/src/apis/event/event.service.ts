import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entites/event.entity';

@Injectable()
export class EventService {
  constructor(@InjectRepository(Event) private readonly eventRepository: Repository<Event>) {}
}
