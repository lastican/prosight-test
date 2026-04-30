export class LocusMember {
  locusMemberId: number;
  regionId: number;
  locusId: number;
  membershipStatus: string;
}

export class GetLocusResponseItem {
  id: number;
  assemblyId: string;
  locusName: string;
  publicLocusName: string;
  chromosome: string;
  strand: string;
  locusStart: number;
  locusStop: number;
  memberCount: number;

  ursTaxid?: string;
  locusMembers?: LocusMember[];
}


export class PaginationMeta {
  index: number;
  limit: number;
  total: number;
}

export class GetLocusResponse {
  data: GetLocusResponseItem[];
  pagination: PaginationMeta;
}