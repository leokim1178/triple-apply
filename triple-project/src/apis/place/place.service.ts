import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './entities/place.entity';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}

  async fetch({ id }) {
    const place = await this.placeRepository.findOne({ where: { id } });
    if (!place) throw new NotFoundException('여행지 정보가 존재하지 않습니다');
    return place;
  }
  async fetchAll() {
    const result = await this.placeRepository.find({});
    console.log(result);
    return result;
  }
  async create({ createPlaceInput }) {
    return await this.placeRepository.save({ ...createPlaceInput });
  }

  async update({ id, updatePlaceInput }) {
    const place = await this.fetch({ id });
    return await this.placeRepository.save({
      ...place,
      ...updatePlaceInput,
    });
  }

  async delete({ id }) {
    await this.fetch({ id });
    const result = await this.placeRepository.delete({ id });
    return result.affected ? true : false;
  }
}
