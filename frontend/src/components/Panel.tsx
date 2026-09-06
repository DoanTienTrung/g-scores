import type { ReactNode } from 'react';
import type { ResourceStatus } from '../hooks/useApiResource';

interface PanelProps {
  title: string;
  description?: string;
  status: ResourceStatus;
  error: string | null;
  onRetry: () => void;
  children: ReactNode;
}

/** Renders the loading and error states so each panel only writes its content. */
export function Panel({
  title,
  description,
  status,
  error,
  onRetry,
  children,
}: PanelProps) {
  return (
    <section className="rounded-xl bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        )}
      </div>

      <div className="p-6">
        {status === 'loading' && (
          <div className="h-64 animate-pulse rounded-lg bg-slate-100" />
        )}

        {status === 'error' && (
          <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <p>{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {status === 'success' && children}
      </div>
    </section>
  );
}
