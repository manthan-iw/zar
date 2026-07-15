'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  value: string;
  label: string;
  animate?: boolean;
}

function parseNumericValue(value: string): { num: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)$/);
  if (match) return { num: parseInt(match[1], 10), suffix: match[2] };
  return { num: 0, suffix: value };
}

export default function StatCard({ value, label, animate = false }: StatCardProps) {
  const { num: target, suffix } = parseNumericValue(value);
  const [count, setCount] = useState(animate ? 0 : target);
  const ref = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasRunRef = useRef(false);

  const runCounter = useCallback(() => {
    if (!animate || hasRunRef.current) return; 
    hasRunRef.current = true;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCount(0);
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    intervalRef.current = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = null;
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
  }, [animate, target]);

  useEffect(() => {
    if (!animate || !ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRunRef.current) {
          runCounter();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [animate, runCounter]);

  return (
    <div className={styles.statCard} ref={ref}>
      <span className={styles.value}>{count}{suffix}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
