import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePlaceInput } from './dto/createPlaceInput';
import { UpdatePlaceInput } from './dto/updatePlaceInput';
import { PlaceService } from './place.service';

@ApiTags('여행지')
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get(':id')
  fetchPlace(@Param('id') id: number) {
    return this.placeService.fetch({ id });
  }

  @Get('list')
  fetchPlaces() {
    return this.placeService.fetchAll();
  }

  @Post()
  createPlace(
    @Body()
    createPlaceInput: CreatePlaceInput,
  ) {
    return this.placeService.create({ createPlaceInput });
  }

  @Patch(':id')
  updatePlace(@Param('id') id: number, @Body() updatePlaceInput: UpdatePlaceInput) {
    return this.placeService.update({ id, updatePlaceInput });
  }

  @Delete(':id')
  deletePlace(@Param('id') id: number) {
    return this.placeService.delete({
      id,
    });
  }
}
