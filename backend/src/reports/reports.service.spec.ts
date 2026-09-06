import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let service: ReportsService;
  let findMany: ReturnType<typeof vi.fn>;
  let queryRawUnsafe: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    findMany = vi.fn();
    queryRawUnsafe = vi.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: {
            subjectStatistic: { findMany },
            $queryRawUnsafe: queryRawUnsafe,
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  describe('getStatistics', () => {
    it('returns the four bands with their labels, for the chart legend', async () => {
      findMany.mockResolvedValue([]);

      const result = await service.getStatistics();

      expect(result.levels).toEqual([
        { level: 1, label: 'Từ 8 điểm' },
        { level: 2, label: 'Từ 6 đến dưới 8' },
        { level: 3, label: 'Từ 4 đến dưới 6' },
        { level: 4, label: 'Dưới 4 điểm' },
      ]);
    });

    it('lists every subject even when the table is empty', async () => {
      findMany.mockResolvedValue([]);

      const result = await service.getStatistics();

      expect(result.subjects).toHaveLength(9);
    });

    it('reports zero for a band no candidate reached', async () => {
      findMany.mockResolvedValue([{ subject: 'toan', level: 1, total: 5 }]);

      const toan = (await service.getStatistics()).subjects.find(
        (s) => s.code === 'toan',
      );

      expect(toan?.counts).toEqual({ 1: 5, 2: 0, 3: 0, 4: 0 });
      expect(toan?.total).toBe(5);
    });
  });

  describe('getTopStudents', () => {
    it('defaults to group A', async () => {
      queryRawUnsafe.mockResolvedValue([]);

      expect((await service.getTopStudents()).group).toBe('A');
    });

    it('rejects an unknown group without touching the database', async () => {
      await expect(service.getTopStudents('Z')).rejects.toThrow(
        BadRequestException,
      );
      expect(queryRawUnsafe).not.toHaveBeenCalled();
    });

    it('never lets a crafted group code reach the database', async () => {
      await expect(
        service.getTopStudents("A'; DROP TABLE exam_results--"),
      ).rejects.toThrow(BadRequestException);
      expect(queryRawUnsafe).not.toHaveBeenCalled();
    });

    it('sums the group columns and breaks ties by registration number', async () => {
      queryRawUnsafe.mockResolvedValue([]);

      await service.getTopStudents('A');

      const sql = queryRawUnsafe.mock.calls[0][0] as string;
      expect(sql).toContain('"toan" + "vat_li" + "hoa_hoc"');
      expect(sql).toContain('ORDER BY total DESC, sbd ASC');
      expect(sql).toContain('LIMIT 10');
    });

    it('numbers the students from one', async () => {
      queryRawUnsafe.mockResolvedValue([
        { sbd: '01000001', toan: '9.6', vat_li: '10', hoa_hoc: '10', total: '29.6' },
        { sbd: '01000002', toan: '9.8', vat_li: '9.75', hoa_hoc: '10', total: '29.55' },
      ]);

      const result = await service.getTopStudents('A');

      expect(result.students[0]).toEqual({
        rank: 1,
        sbd: '01000001',
        total: 29.6,
        scores: [
          { code: 'toan', displayName: 'Toán', score: 9.6 },
          { code: 'vatLi', displayName: 'Vật lí', score: 10 },
          { code: 'hoaHoc', displayName: 'Hoá học', score: 10 },
        ],
      });
      expect(result.students[1].rank).toBe(2);
    });
  });
});
