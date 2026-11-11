import { useEffect, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { IMAGES } from '../data/images';

/**
 * Callers may position the figure themselves (hero images pass `absolute
 * inset-0`). Tailwind's `relative` and `absolute` utilities both set
 * `position`, and the one that wins is decided by stylesheet order, not by the
 * order of the class attribute — so only add our default `relative` when the
 * caller has not supplied a position of their own.
 */
const POSITIONED = /(^|\s)(absolute|fixed|sticky|static)(\s|$)/;
const base = (className: string) =>
  POSITIONED.test(className) ? className : `relative ${className}`;

interface Props {
  /** Key into the image manifest. */
  name: string | null;
  alt?: string;
  className?: string;
  /** Eager-load above-the-fold imagery. */
  priority?: boolean;
  /** Short caption shown bottom-right over the image. */
  showCredit?: boolean;
  sizes?: string;
}

/**
 * Photograph with a graceful three-state render: shimmer while loading,
 * the image once decoded, and a typographic fallback if it fails or is absent.
 */
export function Img({ name, alt, className = '', priority = false, showCredit = false, sizes }: Props) {
  const entry = name ? IMAGES[name] : undefined;
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(entry ? 'loading' : 'error');
  const ref = useRef<HTMLImageElement>(null);

  // An image restored from cache can complete before React attaches onLoad.
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setStatus('ready');
  }, [entry?.src]);

  if (!entry) {
    return (
      <div
        className={base(`flex items-center justify-center bg-paper-2 text-muted ${className}`)}
        role="img"
        aria-label={alt ?? 'No photograph available'}
      >
        <ImageOff className="size-5 opacity-40" aria-hidden />
      </div>
    );
  }

  return (
    <div className={base(`overflow-hidden bg-paper-2 ${className}`)}>
      {status === 'loading' && <div className="skeleton absolute inset-0" aria-hidden />}
      {status === 'error' ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-paper-2 px-3 text-center">
          <ImageOff className="size-5 text-muted opacity-50" aria-hidden />
          <span className="text-[11px] leading-tight text-muted">{alt ?? entry.alt}</span>
        </div>
      ) : (
        <img
          ref={ref}
          src={entry.src}
          srcSet={entry.srcSet}
          alt={alt ?? entry.alt}
          sizes={sizes ?? '100vw'}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setStatus('ready')}
          onError={() => setStatus('error')}
          className={`size-full object-cover transition-opacity duration-700 ${
            status === 'ready' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      {showCredit && status === 'ready' && entry.credit && (
        <span className="pointer-events-none absolute right-2 bottom-1.5 max-w-[85%] truncate rounded bg-black/35 px-1.5 py-0.5 text-[9px] font-medium text-white/85 backdrop-blur-sm">
          {entry.credit}
        </span>
      )}
    </div>
  );
}
