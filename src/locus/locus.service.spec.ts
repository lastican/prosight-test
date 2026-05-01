import { Test, TestingModule } from '@nestjs/testing';
import { LocusService } from './locus.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderDir, OrderField, SideloadingOption } from './dto/get-request.dto';

const mockRows = [
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
];

const mockPrisma = {
  rncLocus: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('LocusService', () => {
  let service: LocusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocusService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<LocusService>(LocusService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLocusList', () => {
    it('should return rows and pagination with defaults', async () => {
      mockPrisma.$transaction.mockResolvedValue([mockRows, 1]);

      const result = await service.getLocusList({});

      expect(result.rows).toEqual(mockRows);
      expect(result.total).toBe(1);
      expect(result.limit).toBe(1000);
      expect(result.index).toBe(0);
    });

    it('should respect limit and index from query', async () => {
      mockPrisma.$transaction.mockResolvedValue([mockRows, 1]);

      const result = await service.getLocusList({ limit: 50, index: 10 });

      expect(result.limit).toBe(50);
      expect(result.index).toBe(10);
    });

    it('should return rows when id filter is provided', async () => {
      mockPrisma.$transaction.mockResolvedValue([mockRows, 1]);

      const result = await service.getLocusList({ id: [1, 2] });

      expect(result.rows).toEqual(mockRows);
    });

    it('should return rows when assemblyId filter is provided', async () => {
      mockPrisma.$transaction.mockResolvedValue([mockRows, 1]);

      const result = await service.getLocusList({ assemblyId: 'Rrox_v1' });

      expect(result.rows).toEqual(mockRows);
    });

    it('should not include members when sideloading is absent', async () => {
      mockPrisma.$transaction.mockResolvedValue([mockRows, 1]);

      const result = await service.getLocusList({});

      expect(result.rows[0].members).toEqual([]);
    });

    it('should include members when sideloading is requested', async () => {
      const rowsWithMembers = [
        {
          ...mockRows[0],
          members: [
            {
              id: BigInt(1),
              ursTaxid: 'URS0000A888AB_61622',
              regionId: 123,
              locusId: BigInt(1),
              membershipStatus: 'member',
            },
          ],
        },
      ];
      mockPrisma.$transaction.mockResolvedValue([rowsWithMembers, 1]);

      const result = await service.getLocusList({
        sideloading: [SideloadingOption.LOCUS_MEMBERS],
      });

      expect(result.rows[0].members).toHaveLength(1);
    });

    it('should return rows when order and orderDir are provided', async () => {
      mockPrisma.$transaction.mockResolvedValue([mockRows, 1]);

      const result = await service.getLocusList({
        order: OrderField.MEMBER_COUNT,
        orderDir: OrderDir.DESC,
      });

      expect(result.rows).toEqual(mockRows);
    });

    it('should return rows when only order is provided without orderDir', async () => {
      mockPrisma.$transaction.mockResolvedValue([mockRows, 1]);

      const result = await service.getLocusList({
        order: OrderField.LOCUS_START,
      });

      expect(result.rows).toEqual(mockRows);
    });

    it('should return total from count', async () => {
      mockPrisma.$transaction.mockResolvedValue([mockRows, 42]);

      const result = await service.getLocusList({});

      expect(result.total).toBe(42);
    });
  });
});