import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

export interface ErrorBody {
  statusCode: number;
  /** Always a single string, safe to render straight into the UI. */
  message: string;
  /** Present only when validation produced more than one message. */
  details?: string[];
  path: string;
  timestamp: string;
}

/**
 * Gives every error one shape, and keeps internals off the wire.
 * `@Catch()` with no argument means: catch everything.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const statusCode = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Đã có lỗi xảy ra, vui lòng thử lại sau';
    let details: string[] | undefined;

    if (isHttp) {
      const body = exception.getResponse();
      const raw =
        typeof body === 'string'
          ? body
          : (body as { message?: string | string[] }).message;

      if (Array.isArray(raw)) {
        message = raw[0];
        if (raw.length > 1) details = raw;
      } else if (typeof raw === 'string') {
        message = raw;
      }
    } else {
      // Unexpected: log the real error, tell the client nothing about it.
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const errorBody: ErrorBody = {
      statusCode,
      message,
      ...(details ? { details } : {}),
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(errorBody);
  }
}
