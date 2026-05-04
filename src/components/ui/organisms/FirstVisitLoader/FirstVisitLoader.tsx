'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AppLoader from '@/components/ui/organisms/AppLoader/AppLoader';
import styles from './FirstVisitLoader.module.css';

const HIDE_DELAY_MS = 1400;

export default function FirstVisitLoader() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (pathname !== '/') {
      return;
    }

    const showTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, 0);

    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, HIDE_DELAY_MS);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (pathname !== '/' || !isVisible) {
    return null;
  }

  return (
    <div className={styles.overlay} role="status" aria-live="polite" aria-label="Loading application">
      <AppLoader delayMs={0} size={150} label="git add ." />
    </div>
  );
}
