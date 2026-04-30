import { Module } from '@nestjs/common';
import { LocusModule } from './locus/locus.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [LocusModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}