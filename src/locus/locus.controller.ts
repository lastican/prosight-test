import { Controller, Get, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { LocusService } from './locus.service';
import { GetLocusQuery, SideloadingOption } from './dto/get-request.dto';
import { GetLocusResponse, GetLocusResponseItem, LocusMember } from './dto/get-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/role.enum';
import { User } from '../users/user.entity';

const LIMITED_REGION_IDS = [86118093, 86696489, 88186467];

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.NORMAL, Role.LIMITED)
@Controller('locus')
export class LocusController {
  constructor(private readonly locusService: LocusService) {}

  @Get()
  async getLocusList(
    @Query() query: GetLocusQuery,
    @CurrentUser() user: User,
  ): Promise<GetLocusResponse> {

    if (user.role === Role.NORMAL && query.sideloading?.length) {
      throw new ForbiddenException('Sideloading is not allowed for your role');
    }

    if (user.role === Role.LIMITED) {
      if (query.sideloading?.length) {
        throw new ForbiddenException('Sideloading is not allowed for your role');
      }
      query.regionId = LIMITED_REGION_IDS;
    }

    const { rows, total, index, limit } = await this.locusService.getLocusList(query);

    const data: GetLocusResponseItem[] = rows.map((locus) => {
      const { members, ...locusFields } = locus;

      const item: GetLocusResponseItem = {
        ...locusFields,
        id: Number(locus.id),
      };

      if (user.role === Role.ADMIN && query.sideloading?.includes(SideloadingOption.LOCUS_MEMBERS)) {
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