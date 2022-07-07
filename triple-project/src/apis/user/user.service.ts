import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async fetch({ email }) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('유저 정보가 존재하지 않습니다');
    return user;
  }

  async fetchAll() {
    return await this.userRepository.find();
  }

  async create({ createUserInput }) {
    return await this.userRepository.save({ ...createUserInput });
  }

  async update({ email, updateUserInput }) {
    const user = await this.fetch({ email });
    return await this.userRepository.save({
      ...user,
      ...updateUserInput,
    });
  }

  async delete({ email }) {
    await this.fetch({ email });
    const result = await this.userRepository.delete({ email });
    return result.affected ? true : false;
  }
}
