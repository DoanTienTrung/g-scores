import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Tổng quan', end: true },
  { to: '/tra-cuu', label: 'Tra cứu điểm', end: false },
  { to: '/thong-ke', label: 'Báo cáo', end: false },
];

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'block rounded-lg px-4 py-2.5 text-sm font-medium transition',
      isActive
        ? 'bg-white/15 text-white shadow-sm'
        : 'text-indigo-100 hover:bg-white/10 hover:text-white',
    ].join(' ');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 bg-indigo-900 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-md p-2 hover:bg-white/10 md:hidden"
          >
            <span className="block h-0.5 w-5 bg-white" />
            <span className="mt-1 block h-0.5 w-5 bg-white" />
            <span className="mt-1 block h-0.5 w-5 bg-white" />
          </button>

          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              G-Scores
            </h1>
            <p className="hidden text-xs text-indigo-200 sm:block">
              Tra cứu điểm thi tốt nghiệp THPT 2024
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        <aside
          className={[
            'shrink-0 rounded-xl bg-indigo-800 p-3 shadow-md',
            'md:block md:w-56',
            menuOpen
              ? 'fixed inset-x-4 top-20 z-10 block'
              : 'hidden',
          ].join(' ')}
        >
          <nav className="space-y-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
