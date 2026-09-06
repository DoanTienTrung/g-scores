import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { addNotFoundHandler, configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';

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

describe('Students (e2e)', () => {
  let app: INestApplication;
  const findUnique = vi.fn();

  beforeAll(async () => {
    // Prisma is replaced, so these tests need no database and run on CI.
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        examResult: { findUnique },
        $queryRaw: () => Promise.resolve([]),
      })
      .compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
    addNotFoundHandler(app);
  });

  beforeEach(() => {
    findUnique.mockClear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/students/:sbd returns the score list', async () => {
    findUnique.mockResolvedValue(EXAM_RESULT);

    const response = await request(app.getHttpServer())
      .get('/api/students/01000001')
      .expect(200);

    expect(response.body.sbd).toBe('01000001');
    expect(response.body.scores).toHaveLength(9);
    expect(response.body.scores[0]).toEqual({
      code: 'toan',
      displayName: 'Toán',
      score: 8.4,
    });
  });

  it('GET /api/students/:sbd returns 404 in the shared error shape', async () => {
    findUnique.mockResolvedValue(null);

    const response = await request(app.getHttpServer())
      .get('/api/students/99999999')
      .expect(404);

    expect(response.body).toMatchObject({
      statusCode: 404,
      message: 'Không tìm thấy số báo danh 99999999',
      path: '/api/students/99999999',
    });
  });

  /**
   * The one case a unit test cannot cover: ValidationPipe only runs in the
   * HTTP layer, so calling the service directly would never exercise it.
   */
  it('GET /api/students/:sbd rejects a number that is not 8 digits', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/students/abc')
      .expect(400);

    expect(response.body.message).toBe('Số báo danh phải gồm đúng 8 chữ số');
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('GET an unknown route returns JSON, not HTML', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/khong-ton-tai')
      .expect(404);

    expect(response.body.statusCode).toBe(404);
  });
});
