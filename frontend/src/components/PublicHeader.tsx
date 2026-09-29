import { Link, NavLink } from 'react-router-dom';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

const link = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`;

export function PublicHeader() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
      <Link to="/" className="font-display text-lg font-semibold tracking-tight">
        <Logo size={30} />
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-3 sm:gap-5">
        <NavLink to="/" end className={link}>
          Home
        </NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" className={link}>Dashboard</NavLink>
            <NavLink to="/explore" className="hidden text-sm font-medium text-muted hover:text-ink sm:inline">Explore</NavLink>
            <NavLink to="/portfolio" className="hidden text-sm font-medium text-muted hover:text-ink sm:inline">Portfolio</NavLink>
            <NavLink to="/watchlist" className="hidden text-sm font-medium text-muted hover:text-ink sm:inline">Watchlist</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login" className={link}>Sign in</NavLink>
            <Link
              to="/register"
              className="rounded-card bg-ink px-4 py-2 text-sm font-medium text-paper hover:opacity-90"
            >
              Get started
            </Link>
          </>
        )}
        <ThemeToggle />
      </nav>
    </header>
  );
}
