import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/PublicLayout';

export function NotFound() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-md text-center">
        <p className="font-display text-6xl font-semibold text-brand">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Page not found</h1>
        <p className="mt-2 text-sm text-muted">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-card bg-brand px-6 py-3 text-sm font-medium text-white transition hover:brightness-110"
        >
          Back to home
        </Link>
      </div>
    </PublicLayout>
  );
}
