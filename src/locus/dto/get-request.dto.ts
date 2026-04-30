import { IsEnum, IsInt, IsOptional, IsArray, IsString, Min, ValidateIf } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum MembershipStatus {
  HIGHLIGHTED = 'highlighted',
  MEMBER = 'member',
}

export enum SideloadingOption {
  LOCUS_MEMBERS = 'locusMembers',
}

export enum OrderField {
  MEMBER_COUNT = 'member_count',
  LOCUS_START  = 'locus_start',
  LOCUS_STOP   = 'locus_stop',
}

export enum OrderDir {
  ASC  = 'asc',
  DESC = 'desc',
}


export class GetLocusQuery {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  id?: number[];

  @IsOptional()
  @IsString()
  assemblyId?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  regionId?: number[];

  @IsOptional()
  @IsEnum(MembershipStatus)
  membershipStatus?: MembershipStatus;

  @IsOptional()
  @IsArray()
  @IsEnum(SideloadingOption, { each: true })
  @Transform(({ value }) => (value ? (Array.isArray(value) ? value : [value]) : undefined))
  sideloading?: SideloadingOption[];

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  index?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  limit?: number;

  @ValidateIf(o => o.orderDir != null)
  @IsEnum(OrderField)
  order?: OrderField;

  @ValidateIf(o => o.order != null)
  @IsEnum(OrderDir)
  orderDir?: OrderDir;
}