import type { ApiErrorBody } from './types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

/** Carries the backend's status code so callers can tell 404 from 500. */
export class ApiError extends Error {
  // Written out longhand: this tsconfig sets erasableSyntaxOnly, which bans
  // constructor parameter properties because they emit real assignments.
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export async function apiGet<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, { signal });
  } catch (caught) {
    // Aborts are not failures; let the caller ignore them.
    if (caught instanceof DOMException && caught.name === 'AbortError') throw caught;
    // fetch only rejects on network failure, never on a 4xx/5xx status.
    throw new ApiError(0, 'Không kết nối được tới máy chủ. Vui lòng thử lại.');
  }

  if (!response.ok) {
    const body = (await response
      .json()
      .catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(
      response.status,
      body?.message ?? 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
    );
  }

  return response.json() as Promise<T>;
}
