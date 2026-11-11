interface Props {
  percent: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function ProgressRing({
  percent,
  size = 96,
  stroke = 8,
  label,
  sublabel,
  className = '',
}: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  return (
    <div
      className={`relative inline-grid place-items-center ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${clamped}% complete`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-sea-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="text-sea-600 transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span className="absolute grid place-items-center text-center leading-none">
        <span className="display text-xl font-semibold tabular-nums text-sea-700">
          {label ?? `${clamped}%`}
        </span>
        {sublabel && <span className="mt-1 text-[10px] tracking-wide text-muted uppercase">{sublabel}</span>}
      </span>
    </div>
  );
}

export function ProgressBar({
  percent,
  className = '',
  tone = 'sea',
}: {
  percent: number;
  className?: string;
  tone?: 'sea' | 'ochre';
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-line ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out ${
          tone === 'sea' ? 'bg-sea-600' : 'bg-ochre-500'
        }`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
