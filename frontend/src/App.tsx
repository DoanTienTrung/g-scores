import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SearchPage } from './pages/SearchPage';

// Recharts is the heaviest dependency in the app and only the reports page
// needs it, so it is fetched on demand instead of on first paint.
const ReportsPage = lazy(() =>
  import('./pages/ReportsPage').then((m) => ({ default: m.ReportsPage })),
);

const Loading = () => (
  <div className="h-64 animate-pulse rounded-xl bg-white shadow-sm" />
);

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/tra-cuu" replace />} />
          <Route path="tra-cuu" element={<SearchPage />} />
          <Route
            path="thong-ke"
            element={
              <Suspense fallback={<Loading />}>
                <ReportsPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/tra-cuu" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
