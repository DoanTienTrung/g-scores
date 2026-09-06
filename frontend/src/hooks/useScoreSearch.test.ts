import { act, renderHook, waitFor } from '@testing-library/react';
import { ApiError } from '../api/client';
import * as client from '../api/client';
import { useScoreSearch, validateSbd } from './useScoreSearch';

const SCORES = {
  sbd: '01000001',
  maNgoaiNgu: 'N1',
  scores: [{ code: 'toan', displayName: 'Toán', score: 8.4 }],
};

describe('validateSbd', () => {
  it.each([
    ['', 'Vui lòng nhập số báo danh'],
    ['   ', 'Vui lòng nhập số báo danh'],
    ['123', 'Số báo danh phải gồm đúng 8 chữ số'],
    ['abcdefgh', 'Số báo danh phải gồm đúng 8 chữ số'],
    ['123456789', 'Số báo danh phải gồm đúng 8 chữ số'],
  ])('rejects %o', (input, expected) => {
    expect(validateSbd(input)).toBe(expected);
  });

  it('accepts eight digits, including leading zeros', () => {
    expect(validateSbd('01000001')).toBeNull();
    expect(validateSbd('  01000001  ')).toBeNull();
  });
});

describe('useScoreSearch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('starts idle', () => {
    const { result } = renderHook(() => useScoreSearch());

    expect(result.current.status).toBe('idle');
    expect(result.current.data).toBeNull();
  });

  it('holds the scores after a successful lookup', async () => {
    const apiGet = vi.spyOn(client, 'apiGet').mockResolvedValue(SCORES);
    const { result } = renderHook(() => useScoreSearch());

    await act(() => result.current.search('01000001'));

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data).toEqual(SCORES);
    expect(apiGet).toHaveBeenCalledWith('/students/01000001');
  });

  it('separates "not found" from a real failure', async () => {
    vi.spyOn(client, 'apiGet').mockRejectedValue(
      new ApiError(404, 'Không tìm thấy số báo danh 99999999'),
    );
    const { result } = renderHook(() => useScoreSearch());

    await act(() => result.current.search('99999999'));

    await waitFor(() => expect(result.current.status).toBe('notFound'));
    expect(result.current.error).toContain('Không tìm thấy');
  });

  it('reports a server failure as an error', async () => {
    vi.spyOn(client, 'apiGet').mockRejectedValue(new ApiError(500, 'Lỗi máy chủ'));
    const { result } = renderHook(() => useScoreSearch());

    await act(() => result.current.search('01000001'));

    await waitFor(() => expect(result.current.status).toBe('error'));
  });

  it('never calls the API when the input is invalid', async () => {
    const apiGet = vi.spyOn(client, 'apiGet');
    const { result } = renderHook(() => useScoreSearch());

    await act(() => result.current.search('abc'));

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Số báo danh phải gồm đúng 8 chữ số');
    expect(apiGet).not.toHaveBeenCalled();
  });
});
