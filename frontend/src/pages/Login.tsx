import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { PublicLayout } from '../components/PublicLayout';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <div className="mx-auto w-full max-w-sm">
        <Link to="/" className="mb-8 block text-center font-display text-2xl font-semibold tracking-tight">
          <Logo size={32} />
        </Link>
        <div className="rounded-card border border-line bg-surface p-8 shadow-lg shadow-brand/5">
          <h1 className="font-display text-xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Sign in to see your live portfolio.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-card border border-line px-3 py-2 text-sm outline-none focus:border-brand"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-card border border-line px-3 py-2 text-sm outline-none focus:border-brand"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="rounded-card bg-loss-light px-3 py-2 text-sm text-loss">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-card bg-ink py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          New to StockFolio?{' '}
          <Link to="/register" className="font-medium text-brand">
            Create an account
          </Link>
        </p>
      </div>
    </PublicLayout>
  );
}
