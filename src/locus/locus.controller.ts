import { Controller, Get, Query } from '@nestjs/common';
import { LocusService } from './locus.service';
import { GetLocusQuery } from './dto/get-request.dto';
import { GetLocusResponse} from './dto/get-response.dto'


@Controller('locus')
export class LocusController {
  constructor(private readonly locusService: LocusService) {}

}
