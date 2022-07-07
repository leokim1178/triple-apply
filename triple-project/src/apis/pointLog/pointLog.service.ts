import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../review/entities/review.entity';
import { User } from '../user/entities/user.entity';
import { PointLogsOutput } from './dto/pointLogsOutput';
import { RecentPointOutput } from './dto/RecentPointOutput';
import { PointLog } from './entities/pointLog.entity';

@Injectable()
export class PointLogService {
  constructor(
    @InjectRepository(PointLog) private readonly pointLogRepository: Repository<PointLog>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
  ) {}

  //현재 포인트값
  async findRecentLog({ userId }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('유저 정보가 존재하지 않습니다');

    try {
      const result = await this.pointLogRepository
        .createQueryBuilder('pointLog')
        .leftJoin('pointLog.user', 'user')
        .where({ user })
        .orderBy('pointLog.createdAt', 'DESC')
        .getOne();
      if (!result) throw new InternalServerErrorException();
      const output: RecentPointOutput = {
        userEmail: user.email,
        totalPoint: user.point,
        recentPointLog: result,
      };
      return output;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findLogs({ userId, reviewId, page }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('유저 정보가 존재하지 않습니다');
    const qb = this.pointLogRepository
      .createQueryBuilder('pointLog')
      .leftJoin('pointLog.user', 'user')
      .leftJoinAndSelect('pointLog.review', 'review')
      .leftJoinAndSelect('review.place', 'place')
      .where({ user })
      .orderBy('pointLog.createdAt', 'DESC');

    if (reviewId) {
      const review = await this.reviewRepository.findOne({ where: { id: reviewId } });
      if (!review) throw new NotFoundException('여행지 정보가 존재하지 않습니다');
      qb.andWhere({ review });
    }

    try {
      let result;
      let output: PointLogsOutput;
      if (page) {
        result = await qb
          .take(10)
          .skip((page - 1) * 10)
          .getManyAndCount();
        const [pointLogs, total] = result;

        output = { pointLogs, total, page, count: 10 };
      } else {
        result = await qb.getManyAndCount();
        const [pointLogs, total] = result;
        output = { pointLogs, total };
      }
      return output;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
