import { Module } from '@nestjs/common';
import { LocusService } from './locus.service';
import { LocusController } from './locus.controller';

@Module({
  controllers: [LocusController],
  providers: [LocusService],
})
export class LocusModule {}
