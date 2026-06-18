'use client';

import { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { cn } from '@/lib/utils';
import { imagePath } from '@/lib/imagePath';
import styles from './AppLoader.module.css';

interface AppLoaderProps {
  className?: string;
  size?: number;
  label?: string;
  delayMs?: number;
  showLabel?: boolean;
  src?: string;
}

export default function AppLoader({
  className,
  size = 140,
  label = 'Loading...',
  delayMs = 200,
  showLabel = true,
  src: initialSrc = '/animations/loader.lottie',
}: AppLoaderProps) {
  const [isVisible, setIsVisible] = useState(delayMs === 0);
  const [src, setSrc] = useState(initialSrc);
  const playerRef = useRef<{ isLoaded?: boolean } | null>(null);

  useEffect(() => {
    if (delayMs === 0) return;

    const delayTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, delayMs);

    return () => {
      window.clearTimeout(delayTimer);
    };
  }, [delayMs]);

  useEffect(() => {
    if (src !== '/animations/loader.lottie') return;

    // If the .lottie payload fails to initialize, switch to JSON source.
    const fallbackTimer = window.setTimeout(() => {
      if (!playerRef.current?.isLoaded) {
        setSrc('/animations/loader.json');
      }
    }, 1200);

    return () => {
      window.clearTimeout(fallbackTimer);
    };
  }, [src]);

  useEffect(() => {
    setSrc(initialSrc);
  }, [initialSrc]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={cn(styles.loaderRoot, className)} role="status" aria-live="polite" aria-label={label}>
      <DotLottieReact
        src={imagePath(src)}
        loop
        autoplay
        className={styles.loaderCanvas}
        style={{ width: size, height: size }}
        dotLottieRefCallback={(dotLottie) => {
          playerRef.current = dotLottie;
        }}
      />
      {showLabel ? <span className={styles.loaderLabel}>{label}</span> : null}
    </div>
  );
}
