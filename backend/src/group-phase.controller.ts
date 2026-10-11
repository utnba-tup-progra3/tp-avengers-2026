import { Controller, Get, Query, HttpCode } from '@nestjs/common';
import { GroupPhaseService } from './group-phase.service';

@Controller('group-phase')
export class GroupPhaseController {
  constructor(private readonly groupPhaseService: GroupPhaseService) {}

  @Get()
  @HttpCode(200) 
  async getGroupPhaseData(@Query('groupId') groupId?: string) {
    return await this.groupPhaseService.getData(groupId);
  }
}
