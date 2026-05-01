import { Module } from '@nestjs/common';
import { LocusModule } from './locus/locus.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [LocusModule, PrismaModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}