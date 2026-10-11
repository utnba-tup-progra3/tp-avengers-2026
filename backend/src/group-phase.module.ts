import { Module, HttpModule } from '@nestjs/common';
import { GroupPhaseController } from './group-phase.controller';
import { GroupPhaseService } from './group-phase.service';

@Module({
  imports: [HttpModule], 
  controllers: [GroupPhaseController],
  providers: [GroupPhaseService],
})
export class GroupPhaseModule {}
