import { useCallback, useState } from 'react';
import { ApiError, apiGet } from '../api/client';
import type { StudentScores } from '../api/types';

export type SearchStatus = 'idle' | 'loading' | 'success' | 'notFound' | 'error';

const SBD_PATTERN = /^\d{8}$/;

/**
 * Mirrors the backend rule so the user is told immediately instead of after
 * a round trip. The server still validates: this is convenience, not security.
 */
export function validateSbd(input: string): string | null {
  const value = input.trim();
  if (value === '') return 'Vui lòng nhập số báo danh';
  if (!SBD_PATTERN.test(value)) return 'Số báo danh phải gồm đúng 8 chữ số';
  return null;
}

export function useScoreSearch() {
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [data, setData] = useState<StudentScores | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (input: string) => {
    const validationError = validateSbd(input);
    if (validationError) {
      setStatus('error');
      setError(validationError);
      setData(null);
      return;
    }

    setStatus('loading');
    setError(null);
    setData(null);

    try {
      const result = await apiGet<StudentScores>(
        `/students/${input.trim()}`,
      );
      setData(result);
      setStatus('success');
    } catch (caught) {
      const apiError = caught instanceof ApiError ? caught : null;
      // 404 is an expected outcome, not a failure: it gets its own state so
      // the page can show a friendly message instead of an error box.
      setStatus(apiError?.statusCode === 404 ? 'notFound' : 'error');
      setError(apiError?.message ?? 'Đã có lỗi xảy ra, vui lòng thử lại sau.');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);

  return { status, data, error, search, reset };
}
