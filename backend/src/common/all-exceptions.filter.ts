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

const FALLBACK_MESSAGE = 'Đã có lỗi xảy ra, vui lòng thử lại sau';

/** Nest puts validation messages in an array and everything else in a string. */
function describe(exception: HttpException): Pick<ErrorBody, 'message' | 'details'> {
  const body = exception.getResponse();
  const raw =
    typeof body === 'string'
      ? body
      : (body as { message?: string | string[] }).message;

  if (Array.isArray(raw)) {
    return raw.length > 1
      ? { message: raw[0], details: raw }
      : { message: raw[0] };
  }

  return { message: typeof raw === 'string' ? raw : FALLBACK_MESSAGE };
}

/** Gives every error one shape, and keeps internals off the wire. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {
      // Log the real error, tell the client nothing about it.
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: FALLBACK_MESSAGE,
        path: request.url,
        timestamp: new Date().toISOString(),
      } satisfies ErrorBody);
      return;
    }

    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      ...describe(exception),
      path: request.url,
      timestamp: new Date().toISOString(),
    } satisfies ErrorBody);
  }
}
