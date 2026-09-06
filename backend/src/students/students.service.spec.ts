import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { StudentsService } from './students.service';

/** Shaped like a row of exam_results: a natural sciences candidate. */
const EXAM_RESULT = {
  sbd: '01000001',
  toan: '8.4',
  nguVan: '6.75',
  ngoaiNgu: '8.0',
  vatLi: '6.0',
  hoaHoc: '5.25',
  sinhHoc: '5.0',
  lichSu: null,
  diaLi: null,
  gdcd: null,
  maNgoaiNgu: 'N1',
};

describe('StudentsService', () => {
  let service: StudentsService;
  let findUnique: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    findUnique = vi.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        { provide: PrismaService, useValue: { examResult: { findUnique } } },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
  });

  it('looks the candidate up by primary key', async () => {
    findUnique.mockResolvedValue(EXAM_RESULT);

    await service.findBySbd('01000001');

    expect(findUnique).toHaveBeenCalledWith({ where: { sbd: '01000001' } });
  });

  it('returns one entry per subject, in registry order', async () => {
    findUnique.mockResolvedValue(EXAM_RESULT);

    const result = await service.findBySbd('01000001');

    expect(result.scores).toHaveLength(9);
    expect(result.scores[0]).toEqual({
      code: 'toan',
      displayName: 'Toán',
      score: 8.4,
    });
  });

  it('keeps a subject the candidate did not sit as null, never as zero', async () => {
    findUnique.mockResolvedValue(EXAM_RESULT);

    const result = await service.findBySbd('01000001');

    expect(result.scores.find((s) => s.code === 'lichSu')?.score).toBeNull();
  });

  it('throws NotFound when the registration number does not exist', async () => {
    findUnique.mockResolvedValue(null);

    await expect(service.findBySbd('99999999')).rejects.toThrow(
      NotFoundException,
    );
  });
});
