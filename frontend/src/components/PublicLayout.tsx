import { ReactNode } from 'react';
import { PublicHeader } from './PublicHeader';
import { Footer } from './Footer';

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <PublicHeader />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="relative w-full">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
