import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiNotFoundResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePlaceInput } from './dto/createPlaceInput';
import { UpdatePlaceInput } from './dto/updatePlaceInput';
import { Place } from './entities/place.entity';
import { PlaceService } from './place.service';

/**
 * @author leokim1178
 * @summary 여행지 관련 api입니다
 * @link http://localhost:3001/api-docs/#/%EC%97%AC%ED%96%89%EC%A7%80
 * @description api 설명은 주석 대신 swagger description으로 대체했습니다
 */
@ApiTags('여행지')
@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  @ApiResponse({ type: Place, status: 200, description: '여행지 조회 성공' })
  @ApiNotFoundResponse({ status: 404, description: '여행지 정보가 존재하지 않습니다' })
  @ApiOperation({ description: '여행지 조회 api입니다', summary: '여행지 조회' })
  @ApiQuery({ name: 'id', description: '여행지의 PK(uuid)입니다' })
  fetchPlace(@Query('id') id: string): Promise<Place> {
    return this.placeService.fetch({ id });
  }

  @Get('list')
  @ApiResponse({ type: Place, isArray: true, status: 200, description: '여행지 리스트 조회 성공' })
  @ApiOperation({ description: '여행지 리스트 조회 api입니다', summary: '여행지 리스트 조회' })
  fetchPlaces(): Promise<Place[]> {
    return this.placeService.fetchAll();
  }

  @Post()
  @ApiResponse({ type: Place, status: 201, description: '여행지 생성 성공' })
  @ApiOperation({ description: '여행지 생성 api입니다', summary: '여행지 생성' })
  @ApiBody({ type: CreatePlaceInput })
  createPlace(
    @Body(ValidationPipe)
    createPlaceInput: CreatePlaceInput,
  ): Promise<Place> {
    return this.placeService.create({ createPlaceInput });
  }

  @Patch(':id')
  @ApiResponse({ type: Place, status: 200, description: '여행지 수정 성공' })
  @ApiNotFoundResponse({ status: 404, description: '여행지 정보가 존재하지 않습니다' })
  @ApiOperation({ description: '여행지 수정 api입니다', summary: '여행지 수정' })
  @ApiBody({ type: UpdatePlaceInput })
  @ApiParam({ name: 'id', description: '여행지의 PK(uuid)입니다' })
  updatePlace(@Param('id') id: string, @Body() updatePlaceInput: UpdatePlaceInput): Promise<Place> {
    return this.placeService.update({ id, updatePlaceInput });
  }

  @Delete(':id')
  @ApiResponse({ type: Boolean, status: 200, description: '여행지 삭제 성공' })
  @ApiNotFoundResponse({ status: 404, description: '여행지 정보가 존재하지 않습니다' })
  @ApiOperation({ description: '여행지 삭제 api입니다', summary: '여행지 삭제' })
  @ApiParam({ name: 'id', description: '여행지의 PK(uuid)입니다' })
  deletePlace(@Param('id') id: string): Promise<boolean> {
    return this.placeService.delete({
      id,
    });
  }
}
