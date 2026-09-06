import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const NAV = [
  { to: '/tra-cuu', label: 'Tra cứu điểm' },
  { to: '/thong-ke', label: 'Báo cáo' },
];

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'block rounded-lg px-4 py-2.5 text-sm font-medium transition',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60',
      isActive
        ? 'bg-white/15 text-white shadow-sm'
        : 'text-indigo-100 hover:bg-white/10 hover:text-white',
    ].join(' ');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 bg-indigo-900 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-md p-2 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:hidden"
          >
            <span className="block h-0.5 w-5 bg-white" />
            <span className="mt-1 block h-0.5 w-5 bg-white" />
            <span className="mt-1 block h-0.5 w-5 bg-white" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
              G-Scores
            </h1>
            <p className="hidden text-xs text-indigo-200 sm:block">
              Tra cứu điểm thi tốt nghiệp THPT 2024
            </p>
          </div>
        </div>
      </header>

      {menuOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-10 bg-slate-900/30 md:hidden"
        />
      )}

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        <aside
          className={[
            'shrink-0 rounded-xl bg-indigo-800 p-3 shadow-md',
            'md:block md:w-56',
            menuOpen ? 'fixed inset-x-4 top-24 z-20 block' : 'hidden',
          ].join(' ')}
        >
          <nav className="space-y-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
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

      <footer className="mx-auto max-w-7xl px-4 pb-8 text-center text-xs text-slate-400 sm:px-6">
        Dữ liệu: kỳ thi tốt nghiệp THPT 2024 · 1.061.605 thí sinh
      </footer>
    </div>
  );
}
