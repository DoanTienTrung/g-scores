import { useCallback, useEffect, useState } from 'react';
import { ApiError, apiGet } from '../api/client';

export type ResourceStatus = 'loading' | 'success' | 'error';

interface ResourceState<T> {
  status: ResourceStatus;
  data: T | null;
  error: string | null;
}

const INITIAL: ResourceState<never> = {
  status: 'loading',
  data: null,
  error: null,
};

/**
 * Loads one GET endpoint on mount and exposes a retry.
 *
 * The request is aborted on cleanup, so a slow response can never overwrite
 * a newer one, and no state is set synchronously inside the effect.
 */
export function useApiResource<T>(path: string) {
  const [state, setState] = useState<ResourceState<T>>(INITIAL);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    apiGet<T>(path, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ status: 'success', data, error: null });
        }
      })
      .catch((caught: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: 'error',
          data: null,
          error:
            caught instanceof ApiError
              ? caught.message
              : 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
        });
      });

    return () => controller.abort();
  }, [path, attempt]);

  const reload = useCallback(() => {
    // Safe here: an event handler, not an effect.
    setState({ status: 'loading', data: null, error: null });
    setAttempt((previous) => previous + 1);
  }, []);

  return { ...state, reload };
}
