import { renderHook, waitFor } from '@testing-library/react';
import { ApiError } from '../api/client';
import * as client from '../api/client';
import { useApiResource } from './useApiResource';

describe('useApiResource', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('loads the endpoint on mount', async () => {
    const apiGet = vi.spyOn(client, 'apiGet').mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useApiResource<{ ok: boolean }>('/x'));

    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toEqual({ ok: true });
    expect(apiGet).toHaveBeenCalledWith('/x', expect.any(AbortSignal));
  });

  it('surfaces the backend message on failure', async () => {
    vi.spyOn(client, 'apiGet').mockRejectedValue(new ApiError(500, 'Lỗi máy chủ'));

    const { result } = renderHook(() => useApiResource('/x'));

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error).toBe('Lỗi máy chủ');
  });
})
