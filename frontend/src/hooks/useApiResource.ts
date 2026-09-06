import { useCallback, useEffect, useState } from 'react';
import { ApiError, apiGet } from '../api/client';

export type ResourceStatus = 'loading' | 'success' | 'error';

/**
 * Loads one GET endpoint on mount and exposes a retry.
 * Both report panels need exactly this, so it lives in one place instead of
 * being written twice with slightly different bugs.
 */
export function useApiResource<T>(path: string) {
  const [status, setStatus] = useState<ResourceStatus>('loading');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      setData(await apiGet<T>(path));
      setStatus('success');
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      );
      setStatus('error');
    }
  }, [path]);

  useEffect(() => {
    void load();
  }, [load]);

  return { status, data, error, reload: load };
}
