'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { imagePath } from '@/lib/imagePath';
import InstagramCard from '@/components/ui/molecules/InstagramCard/InstagramCard';
import type { InstagramPost } from '@/types/instagram';
import styles from './InstagramSection.module.css';

function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
  };

  return debounced;
}

const SKELETON_COUNT = 6;

/** Static gallery from pre-API Instagram section (commit 56eafcd) — used when token/API fails */
const FALLBACK_POSTS: InstagramPost[] = [
  { id: 'fallback-1', image: '/images/homepage/reel_1.webp', alt: 'Gold bangle design 1', mediaType: 'IMAGE' },
  { id: 'fallback-2', image: '/images/homepage/reel_2.webp', alt: 'Gold bangle design 2', mediaType: 'IMAGE' },
  { id: 'fallback-3', image: '/images/homepage/reel_3.webp', alt: 'Gold bangle design 3', mediaType: 'IMAGE' },
  { id: 'fallback-4', image: '/images/homepage/reel_4.webp', alt: 'Gold bangle design 4', mediaType: 'IMAGE' },
  { id: 'fallback-5', image: '/images/homepage/reel_2.webp', alt: 'Gold bangle design 5', mediaType: 'IMAGE' },
  { id: 'fallback-6', image: '/images/homepage/reel_3.webp', alt: 'Gold bangle design 6', mediaType: 'IMAGE' },
];

function useVisibleCount() {
  const [count, setCount] = useState(4);

  useEffect(() => {
    const update = debounce(() => {
      const w = window.innerWidth;
      if (w >= 1280) setCount(4);
      else if (w >= 765) setCount(3);
      else setCount(2);
    }, 150);

    const w = window.innerWidth;
    if (w >= 1280) setCount(4);
    else if (w >= 765) setCount(3);
    else setCount(2);

    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      update.cancel();
    };
  }, []);

  return count;
}

function resolveApiPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}${path}`;
}

function resolveMediaPath(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return imagePath(path.startsWith('/') ? path : `/${path}`);
}

export default function InstagramSection() {
  const visibleCount = useVisibleCount();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadInstagramPosts() {
      try {
        const response = await fetch(resolveApiPath('/api/instagram'));
        const payload = (await response.json()) as {
          success?: boolean;
          posts?: InstagramPost[];
          error?: string;
        };

        if (cancelled) return;

        if (payload.success && Array.isArray(payload.posts) && payload.posts.length > 0) {
          setPosts(payload.posts);
        } else {
          // Token expired / API error / empty feed → static section
          setPosts(FALLBACK_POSTS);
        }
      } catch {
        if (!cancelled) {
          setPosts(FALLBACK_POSTS);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadInstagramPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayItems = isLoading
    ? Array.from({ length: SKELETON_COUNT }, (_, index) => ({ id: `skeleton-${index}` }))
    : posts;

  const maxIndex = Math.max(0, displayItems.length - visibleCount);

  useEffect(() => {
    if (currentIndex > maxIndex) setCurrentIndex(Math.max(0, maxIndex));
  }, [visibleCount, maxIndex, currentIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(maxIndex, i + 1));
  }, [maxIndex]);

  const progress = maxIndex > 0 ? currentIndex / maxIndex : 0;

  return (
    <section>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Image
            src={imagePath('/images/homepage/instagram-icon.webp')}
            alt="Instagram"
            width={72}
            height={72}
            className={styles.instagramIcon}
          />
          <div className={styles.titleBlock}>
            <h2 className="fs_54">Join Our Instagram Community</h2>
            <p>
              Discover new designs, upcoming exhibitions, and moments that shape the ZAR journey in gold jewellery.
            </p>
          </div>
        </motion.div>

        {displayItems.length > 0 && (
          <>
            <div className={styles.slider}>
              <motion.div
                className={styles.track}
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                  hidden: {},
                }}
              >
                {isLoading
                  ? displayItems.map((item) => (
                      <motion.div
                        key={item.id}
                        className={styles.slide}
                        style={{ width: `${100 / visibleCount}%` }}
                      >
                        <InstagramCard image="" alt="" isLoading />
                      </motion.div>
                    ))
                  : posts.map((post) => (
                      <motion.div
                        key={post.id}
                        className={styles.slide}
                        style={{ width: `${100 / visibleCount}%` }}
                        variants={{
                          hidden: { opacity: 0, scale: 0.96 },
                          visible: {
                            opacity: 1,
                            scale: 1,
                            transition: { duration: 0.8, ease: 'easeOut' },
                          },
                        }}
                      >
                        <div className={styles.slideContent}>
                          <InstagramCard
                            image={resolveMediaPath(post.image)}
                            alt={post.alt}
                            videoUrl={post.videoUrl ? resolveMediaPath(post.videoUrl) : undefined}
                          />
                        </div>
                      </motion.div>
                    ))}
              </motion.div>
            </div>

            <div className={styles.navigation}>
              <button
                className={`${styles.navButton} ${currentIndex === 0 ? styles.navDisabled : ''}`}
                aria-label="Previous"
                onClick={prev}
                disabled={currentIndex === 0 || isLoading}
              >
                <svg viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1L1 7L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    left: `${progress * (100 - 100 / (maxIndex + 1))}%`,
                    width: `${100 / (maxIndex + 1)}%`,
                  }}
                />
              </div>
              <button
                className={`${styles.navButton} ${currentIndex === maxIndex ? styles.navDisabled : ''}`}
                aria-label="Next"
                onClick={next}
                disabled={currentIndex === maxIndex || isLoading}
              >
                <svg viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 7L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
