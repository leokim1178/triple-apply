import { Injectable } from '@nestjs/common';
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
    return await this.placeRepository.findOne({ where: { id } });
  }
  async fetchAll() {
    return await this.placeRepository.find();
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
    const result = await this.placeRepository.delete({ id });
    return result.affected ? true : false;
  }
}
