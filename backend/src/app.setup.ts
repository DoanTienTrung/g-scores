import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

/**
 * Everything that turns a bare Nest app into this application.
 * main.ts and the e2e tests both call it, so the tests exercise the same
 * pipeline that production runs.
 */
export function configureApp(app: INestApplication): void {
  app.useGlobalFilters(new AllExceptionsFilter());
  // whitelist strips anything not declared on the DTO;
  // transform turns raw params into the DTO class so decorators run.
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
