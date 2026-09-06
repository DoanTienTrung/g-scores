import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

/** Called by main.ts and by the e2e tests, so both exercise the same pipeline. */
export function configureApp(app: INestApplication): void {
  app.useGlobalFilters(new AllExceptionsFilter());
  // Without transform the params never become the DTO class and the
  // validation decorators silently never run.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
}

/**
 * Unmatched routes never enter the Nest pipeline, so the exception filter
 * cannot see them. Must run after init(), once the router is mounted.
 */
export function addNotFoundHandler(app: INestApplication): void {
  app
    .getHttpAdapter()
    .getInstance()
    .use((req: Request, res: Response) => {
      res.status(404).json({
        statusCode: 404,
        message: `Không tìm thấy đường dẫn ${req.url}`,
        path: req.url,
        timestamp: new Date().toISOString(),
      });
    });
}
