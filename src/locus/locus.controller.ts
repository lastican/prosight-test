import { Controller, Get, Query } from '@nestjs/common';
import { LocusService } from './locus.service';
import { GetLocusQuery, SideloadingOption } from './dto/get-request.dto';
import {
  GetLocusResponse,
  GetLocusResponseItem,
  LocusMember,
} from './dto/get-response.dto';

@Controller('locus')
export class LocusController {
  constructor(private readonly locusService: LocusService) {}

  @Get()
  async getLocusList(@Query() query: GetLocusQuery): Promise<GetLocusResponse> {
    const { rows, total, index, limit } = await this.locusService.getLocusList(query);

    const data: GetLocusResponseItem[] = rows.map((locus) => {
      const { members, ...locusFields } = locus;

      const item: GetLocusResponseItem = {
        ...locusFields,
        id: Number(locus.id),
      };

      if (query.sideloading?.includes(SideloadingOption.LOCUS_MEMBERS)) {
        item.ursTaxid = members[0]?.ursTaxid;
        item.locusMembers = members.map(
          (m): LocusMember => ({
            locusMemberId: Number(m.id),
            regionId: m.regionId,
            locusId: Number(m.locusId),
            membershipStatus: m.membershipStatus,
          }),
        );
      }

      return item;
    });

    return {
      data,
      pagination: { index, limit, total },
    };
  }
}