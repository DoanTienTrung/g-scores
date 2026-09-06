import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { addNotFoundHandler, configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Reports (e2e)', () => {
  let app: INestApplication;
  const findMany = vi.fn();
  const queryRawUnsafe = vi.fn();

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        subjectStatistic: { findMany },
        $queryRawUnsafe: queryRawUnsafe,
        $queryRaw: () => Promise.resolve([]),
      })
      .compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    addNotFoundHandler(app);
  });

  beforeEach(() => {
    findMany.mockReset();
    queryRawUnsafe.mockReset();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/reports/statistics returns a legend and every subject', async () => {
    findMany.mockResolvedValue([{ subject: 'toan', level: 1, total: 5 }]);

    const response = await request(app.getHttpServer())
      .get('/api/reports/statistics')
      .expect(200);

    expect(response.body.levels).toHaveLength(4);
    expect(response.body.subjects).toHaveLength(9);
  });

  it('GET /api/reports/top-students defaults to group A', async () => {
    queryRawUnsafe.mockResolvedValue([]);

    const response = await request(app.getHttpServer())
      .get('/api/reports/top-students')
      .expect(200);

    expect(response.body.group).toBe('A');
  });

  it('GET /api/reports/top-students rejects an unknown group', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/reports/top-students?group=Z')
      .expect(400);

    expect(response.body.statusCode).toBe(400);
    expect(queryRawUnsafe).not.toHaveBeenCalled();
  });
});
