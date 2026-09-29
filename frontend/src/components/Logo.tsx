export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="sf-logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#19B587" />
          <stop offset="1" stopColor="#0B5F45" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#sf-logo-g)" />
      <rect x="14" y="36" width="8" height="14" rx="2" fill="#fff" fillOpacity=".45" />
      <rect x="28" y="30" width="8" height="20" rx="2" fill="#fff" fillOpacity=".7" />
      <rect x="42" y="22" width="8" height="28" rx="2" fill="#fff" />
      <path d="M14 28 L26 20 L34 24 L50 10" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="10" r="3.5" fill="#fff" />
    </svg>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark size={size} />
      <span>
        Stock<span className="text-brand">Folio</span>
      </span>
    </span>
  );
}
