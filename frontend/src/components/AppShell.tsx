import { NavLink, useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { StockSearch } from './StockSearch';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/explore', label: 'Explore' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/watchlist', label: 'Watchlist' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper">
      <div className="flex">
        <aside className="hidden w-60 shrink-0 border-r border-line bg-surface md:flex md:flex-col">
          <div className="flex h-16 items-center border-b border-line px-6">
            <span className="font-display text-lg font-semibold tracking-tight">
              Stock<span className="text-brand">Pro</span>
            </span>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-card px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-light text-brand-dark' : 'text-muted hover:bg-paper hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-line p-4">
            <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="mt-3 w-full rounded-card border border-line px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-loss hover:text-loss"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-16 items-center gap-4 border-b border-line bg-surface px-6">
            <span className="font-display text-lg font-semibold tracking-tight md:hidden">
              Stock<span className="text-brand">Pro</span>
            </span>
            <div className="max-w-md flex-1">
              <StockSearch
                placeholder="Search stocks, e.g. TCS.NS or AAPL"
                onSelect={(symbol) => navigate(`/stock/${symbol}`)}
              />
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
