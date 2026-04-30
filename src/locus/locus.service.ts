import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, RncLocus, RncLocusMember } from 'src/generated/prisma/client';
import { GetLocusQuery, SideloadingOption } from './dto/get-request.dto';


export type LocusWithMembers = RncLocus & {
  members: RncLocusMember[];
};

export type LocusFetchResult = {
  rows: LocusWithMembers[];
  total: number;
  index: number;
  limit: number;
};

@Injectable()
export class LocusService {
  constructor(private readonly prisma: PrismaService) {}

  async getLocusList(query: GetLocusQuery): Promise<LocusFetchResult> {
    const includeMembers = query.sideloading?.includes(SideloadingOption.LOCUS_MEMBERS) ?? false;

    const take = query.limit ?? 1000;
    const skip = query.index ?? 0;

    const findManyArgs: Prisma.RncLocusFindManyArgs = {
      take,
      skip,
      include: {
        members: includeMembers,
      },
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.rncLocus.findMany(findManyArgs),
      this.prisma.rncLocus.count({ where: findManyArgs.where }),
    ]) as [LocusWithMembers[], number];

    return { rows, total, index: skip, limit: take };
  }
}