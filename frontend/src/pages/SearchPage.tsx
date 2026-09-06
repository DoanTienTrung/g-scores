import { useState, type FormEvent } from 'react';
import { useScoreSearch } from '../hooks/useScoreSearch';

const NOT_TAKEN = 'Không thi';

export function SearchPage() {
  const [sbd, setSbd] = useState('');
  const { status, data, error, search } = useScoreSearch();

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void search(sbd);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Tra cứu điểm thi</h2>
        <p className="mt-1 text-sm text-slate-500">
          Nhập số báo danh gồm 8 chữ số, ví dụ 01000001
        </p>

        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={sbd}
            onChange={(event) => setSbd(event.target.value)}
            inputMode="numeric"
            maxLength={8}
            placeholder="Số báo danh"
            aria-label="Số báo danh"
            className="w-full flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-lg bg-indigo-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'loading' ? 'Đang tra cứu…' : 'Tra cứu'}
          </button>
        </form>

        {(status === 'error' || status === 'notFound') && error && (
          <p
            role="alert"
            className={`mt-3 rounded-lg px-4 py-2.5 text-sm ${
              status === 'notFound'
                ? 'bg-amber-50 text-amber-800'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {error}
          </p>
        )}
      </section>

      {status === 'loading' && (
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-9 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        </section>
      )}

      {status === 'success' && data && (
        <section className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-slate-100 px-6 py-4">
            <h3 className="text-base font-semibold text-slate-900">
              Số báo danh {data.sbd}
            </h3>
            {data.maNgoaiNgu && (
              <span className="text-sm text-slate-500">
                Mã ngoại ngữ {data.maNgoaiNgu}
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="px-6 py-3 font-medium">Môn thi</th>
                  <th className="px-6 py-3 text-right font-medium">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {data.scores.map((subject) => (
                  <tr
                    key={subject.code}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="px-6 py-3 text-slate-700">
                      {subject.displayName}
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums">
                      {subject.score === null ? (
                        <span className="text-slate-400">{NOT_TAKEN}</span>
                      ) : (
                        <span className="font-semibold text-slate-900">
                          {subject.score.toFixed(2)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
