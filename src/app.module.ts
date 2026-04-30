import { Module } from '@nestjs/common';
import { LocusModule } from './locus/locus.module';

@Module({
  imports: [LocusModule],
  controllers: [],
  providers: [],
})
export class AppModule {}