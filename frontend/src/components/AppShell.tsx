import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StockSearch } from './StockSearch';
import { Footer } from './Footer';
import { allNavItems, appNavItems } from './navItems';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-card px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-light text-brand-dark' : 'text-muted hover:bg-paper hover:text-ink'
  }`;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-line bg-surface md:flex md:flex-col">
          <div className="flex h-16 items-center border-b border-line px-6">
            <Link to="/" className="font-display text-lg font-semibold tracking-tight">
              <Logo />
            </Link>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-4">
            {appNavItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t border-line p-4">
            <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="mt-3 w-full rounded-card border border-line px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-loss hover:text-loss"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-line bg-surface">
            <div className="flex h-16 items-center gap-4 px-6">
              <Link
                to="/"
                className="font-display text-lg font-semibold tracking-tight md:hidden"
              >
                <Logo />
              </Link>

              <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
                {allNavItems.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="ml-auto max-w-md flex-1">
                <StockSearch
                  placeholder="Search stocks, e.g. TCS.NS or AAPL"
                  onSelect={(symbol) => navigate(`/stock/${symbol}`)}
                />
              </div>

              <ThemeToggle />

              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
                className="rounded-card border border-line p-2 text-ink md:hidden"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  {menuOpen ? (
                    <path d="M4 4l12 12M16 4L4 16" />
                  ) : (
                    <path d="M3 6h14M3 10h14M3 14h14" />
                  )}
                </svg>
              </button>
            </div>

            {menuOpen && (
              <nav aria-label="Mobile" className="flex flex-col gap-1 border-t border-line p-4 md:hidden">
                {allNavItems.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
                    {item.label}
                  </NavLink>
                ))}
                <div className="mt-2 border-t border-line pt-3">
                  <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
                  <p className="truncate text-xs text-muted">{user?.email}</p>
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full rounded-card border border-line px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-loss hover:text-loss"
                  >
                    Sign out
                  </button>
                </div>
              </nav>
            )}
          </header>

          <main className="flex-1 p-6">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
