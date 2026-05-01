import { Test, TestingModule } from '@nestjs/testing';
import { LocusController } from './locus.controller';
import { LocusService } from './locus.service';
import { SideloadingOption } from './dto/get-request.dto';

const mockServiceResult = {
  rows: [
    {
      id: BigInt(1),
      assemblyId: 'Rrox_v1',
      locusName: 'locus_1',
      publicLocusName: 'PUB_1',
      chromosome: 'chr1',
      strand: '+1',
      locusStart: 100,
      locusStop: 200,
      memberCount: 1,
      members: [],
    },
  ],
  total: 1,
  index: 0,
  limit: 1000,
};

const mockLocusService = {
  getLocusList: jest.fn(),
};

describe('LocusController', () => {
  let controller: LocusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocusController],
      providers: [
        { provide: LocusService, useValue: mockLocusService },
      ],
    }).compile();

    controller = module.get<LocusController>(LocusController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLocusList', () => {
    it('should return formatted response with pagination', async () => {
      mockLocusService.getLocusList.mockResolvedValue(mockServiceResult);

      const result = await controller.getLocusList({});

      expect(result.pagination).toEqual({ index: 0, limit: 1000, total: 1 });
    });

    it('should convert BigInt id to Number', async () => {
      mockLocusService.getLocusList.mockResolvedValue(mockServiceResult);

      const result = await controller.getLocusList({});

      expect(typeof result.data[0].id).toBe('number');
      expect(result.data[0].id).toBe(1);
    });

    it('should map locus fields correctly', async () => {
      mockLocusService.getLocusList.mockResolvedValue(mockServiceResult);

      const result = await controller.getLocusList({});
      const item = result.data[0];

      expect(item.assemblyId).toBe('Rrox_v1');
      expect(item.locusName).toBe('locus_1');
      expect(item.chromosome).toBe('chr1');
      expect(item.locusStart).toBe(100);
      expect(item.locusStop).toBe(200);
      expect(item.memberCount).toBe(1);
    });

    it('should not include locusMembers when sideloading is absent', async () => {
      mockLocusService.getLocusList.mockResolvedValue(mockServiceResult);

      const result = await controller.getLocusList({});

      expect(result.data[0].locusMembers).toBeUndefined();
      expect(result.data[0].ursTaxid).toBeUndefined();
    });

    it('should include locusMembers when sideloading is requested', async () => {
      const member = {
        id: BigInt(10),
        ursTaxid: 'URS0000A888AB_61622',
        regionId: 123,
        locusId: BigInt(1),
        membershipStatus: 'member',
      };
      mockLocusService.getLocusList.mockResolvedValue({
        ...mockServiceResult,
        rows: [{ ...mockServiceResult.rows[0], members: [member] }],
      });

      const result = await controller.getLocusList({
        sideloading: [SideloadingOption.LOCUS_MEMBERS],
      });

      expect(result.data[0].locusMembers).toHaveLength(1);
      expect(result.data[0].locusMembers![0].locusMemberId).toBe(10);
      expect(result.data[0].locusMembers![0].regionId).toBe(123);
      expect(result.data[0].locusMembers![0].membershipStatus).toBe('member');
    });

    it('should set ursTaxid from first member when sideloading', async () => {
      const member = {
        id: BigInt(10),
        ursTaxid: 'URS0000A888AB_61622',
        regionId: 123,
        locusId: BigInt(1),
        membershipStatus: 'member',
      };
      mockLocusService.getLocusList.mockResolvedValue({
        ...mockServiceResult,
        rows: [{ ...mockServiceResult.rows[0], members: [member] }],
      });

      const result = await controller.getLocusList({
        sideloading: [SideloadingOption.LOCUS_MEMBERS],
      });

      expect(result.data[0].ursTaxid).toBe('URS0000A888AB_61622');
    });

    it('should convert member BigInt fields to Number', async () => {
      const member = {
        id: BigInt(10),
        ursTaxid: 'URS0000A888AB_61622',
        regionId: 123,
        locusId: BigInt(1),
        membershipStatus: 'member',
      };
      mockLocusService.getLocusList.mockResolvedValue({
        ...mockServiceResult,
        rows: [{ ...mockServiceResult.rows[0], members: [member] }],
      });

      const result = await controller.getLocusList({
        sideloading: [SideloadingOption.LOCUS_MEMBERS],
      });

      const m = result.data[0].locusMembers![0];
      expect(typeof m.locusMemberId).toBe('number');
      expect(typeof m.locusId).toBe('number');
    });

    it('should return empty data array when no rows', async () => {
      mockLocusService.getLocusList.mockResolvedValue({
        ...mockServiceResult,
        rows: [],
        total: 0,
      });

      const result = await controller.getLocusList({});

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
    });
  });
});