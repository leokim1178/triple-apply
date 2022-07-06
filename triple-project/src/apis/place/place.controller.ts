import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePlaceInput } from './dto/createPlaceInput';
import { UpdatePlaceInput } from './dto/updatePlaceInput';
import { Place } from './entities/place.entity';
import { PlaceService } from './place.service';

@ApiTags('여행지')
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get(':id')
  @ApiResponse({ type: Place, status: 200, description: '여행지 조회 성공' })
  @ApiOperation({ description: '여행지 조회 api입니다', summary: '여행지 조회' })
  @ApiParam({ name: 'id', description: '여행지의 PK(uuid)입니다' })
  fetchPlace(@Param('id') id: string): Promise<Place> {
    return this.placeService.fetch({ id });
  }

  @Get('list')
  @ApiResponse({ type: Place, isArray: true, status: 200, description: '여행지 리스트 조회 성공' })
  @ApiOperation({ description: '여행지 리스트 조회 api입니다', summary: '여행지 리스트 조회' })
  fetchPlaces(): Promise<Place[]> {
    return this.placeService.fetchAll();
  }

  @Post()
  @ApiResponse({ type: Place, status: 200, description: '여행지 생성 성공' })
  @ApiOperation({ description: '여행지 생성 api입니다', summary: '여행지 생성' })
  @ApiBody({ type: CreatePlaceInput })
  createPlace(
    @Body()
    createPlaceInput: CreatePlaceInput,
  ): Promise<Place> {
    return this.placeService.create({ createPlaceInput });
  }

  @Patch(':id')
  @ApiResponse({ type: Place, status: 200, description: '여행지 수정 성공' })
  @ApiOperation({ description: '여행지 수정 api입니다', summary: '여행지 수정' })
  @ApiBody({ type: UpdatePlaceInput })
  @ApiParam({ name: 'id', description: '여행지의 PK(uuid)입니다' })
  updatePlace(@Param('id') id: string, @Body() updatePlaceInput: UpdatePlaceInput): Promise<Place> {
    return this.placeService.update({ id, updatePlaceInput });
  }

  @Delete(':id')
  @ApiResponse({ type: Boolean, status: 200, description: '여행지 삭제 성공' })
  @ApiOperation({ description: '여행지 삭제 api입니다', summary: '여행지 삭제' })
  @ApiParam({ name: 'id', description: '여행지의 PK(uuid)입니다' })
  deletePlace(@Param('id') id: string): Promise<boolean> {
    return this.placeService.delete({
      id,
    });
  }
}
