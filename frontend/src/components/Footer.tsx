import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { allNavItems } from './navItems';
import { Logo } from './Logo';

export function Footer() {
  const { isAuthenticated } = useAuth();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <span className="font-display text-lg font-semibold tracking-tight">
            <Logo size={24} />
          </span>
          <p className="mt-2 text-sm text-muted">
            Real-time portfolio tracking for NSE, BSE and US markets.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {isAuthenticated ? (
            allNavItems.map((item) => (
              <Link key={item.to} to={item.to} className="text-muted transition-colors hover:text-ink">
                {item.label}
              </Link>
            ))
          ) : (
            <>
              <Link to="/" className="text-muted transition-colors hover:text-ink">Home</Link>
              <Link to="/login" className="text-muted transition-colors hover:text-ink">Sign in</Link>
              <Link to="/register" className="text-muted transition-colors hover:text-ink">Register</Link>
            </>
          )}
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4 text-xs text-muted md:flex-row md:justify-between">
          <p>© {year} StockFolio. All rights reserved.</p>
          <p>Market data may be delayed and is not investment advice.</p>
        </div>
      </div>
    </footer>
  );
}
