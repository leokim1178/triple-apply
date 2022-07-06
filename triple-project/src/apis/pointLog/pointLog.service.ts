import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { PointLog } from './entities/pointLog.entity';

@Injectable()
export class PointLogService {
  constructor(
    @InjectRepository(PointLog) private readonly pointLogRepository: Repository<PointLog>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async currentPoint({ userId }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const result = await this.pointLogRepository
      .createQueryBuilder('pointLog')
      .leftJoin('pointLog.user', 'user')
      .where({ user })
      .orderBy('pointLog.createdAt', 'DESC')
      .getOne();
    console.log(result);
    return result;
  }
}
