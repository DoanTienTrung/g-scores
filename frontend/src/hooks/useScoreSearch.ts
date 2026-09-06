import { useCallback, useState } from 'react';
import { ApiError, apiGet } from '../api/client';
import type { StudentScores } from '../api/types';

export type SearchStatus = 'idle' | 'loading' | 'success' | 'notFound' | 'error';

interface SearchState {
  status: SearchStatus;
  data: StudentScores | null;
  error: string | null;
}

const IDLE: SearchState = { status: 'idle', data: null, error: null };

const SBD_PATTERN = /^\d{8}$/;

/**
 * Mirrors the backend rule so the user is told immediately instead of after a
 * round trip. The server still validates: this is convenience, not security.
 */
export function validateSbd(input: string): string | null {
  const value = input.trim();
  if (value === '') return 'Vui lòng nhập số báo danh';
  if (!SBD_PATTERN.test(value)) return 'Số báo danh phải gồm đúng 8 chữ số';
  return null;
}

export function useScoreSearch() {
  const [state, setState] = useState<SearchState>(IDLE);

  const search = useCallback(async (input: string) => {
    const invalid = validateSbd(input);
    if (invalid) {
      setState({ status: 'error', data: null, error: invalid });
      return;
    }

    setState({ status: 'loading', data: null, error: null });

    try {
      const data = await apiGet<StudentScores>(`/students/${input.trim()}`);
      setState({ status: 'success', data, error: null });
    } catch (caught) {
      const apiError = caught instanceof ApiError ? caught : null;
      setState({
        // A 404 is an expected outcome, not a failure, so the page can show a
        // friendly message instead of an error box.
        status: apiError?.statusCode === 404 ? 'notFound' : 'error',
        data: null,
        error: apiError?.message ?? 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      });
    }
  }, []);

  return { ...state, search };
}
