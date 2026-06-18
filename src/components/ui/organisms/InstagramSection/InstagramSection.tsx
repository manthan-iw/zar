'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { imagePath } from '@/lib/imagePath';
import InstagramCard from '@/components/ui/molecules/InstagramCard/InstagramCard';
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

const INSTAGRAM_URL = 'https://www.instagram.com/zarjewels/';

const posts = [
  { image: '/images/homepage/reel_1.webp', alt: 'Gold bangle design 1' },
  { image: '/images/homepage/reel_2.webp', alt: 'Gold bangle design 2' },
  { image: '/images/homepage/reel_3.webp', alt: 'Gold bangle design 3' },
  { image: '/images/homepage/reel_4.webp', alt: 'Gold bangle design 4' },
  { image: '/images/homepage/reel_2.webp', alt: 'Gold bangle design 5' },
  { image: '/images/homepage/reel_3.webp', alt: 'Gold bangle design 6' },
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

    // Initial check (immediate)
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

export default function InstagramSection() {
  const visibleCount = useVisibleCount();
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = posts.length - visibleCount;

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
            src={imagePath("/images/homepage/instagram-icon.webp")}
            alt="Instagram"
            width={72}
            height={72}
            className={styles.instagramIcon}
          />
          <div className={styles.titleBlock}>
            <h2 className="fs_54">Join Our Instagram Community</h2>
            <p className="">
              Discover new designs, upcoming exhibitions, and moments that shape the ZAR journey in gold jewellery.
            </p>
          </div>
        </motion.div>

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
              hidden: {}
            }}
          >
            {posts.map((post, i) => (
              <motion.div
                key={i}
                className={styles.slide}
                style={{ width: `${100 / visibleCount}%` }}
                variants={{
                  hidden: { opacity: 0, scale: 0.96 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } }
                }}
              >
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.slideLink}
                >
                  <InstagramCard image={imagePath(post.image)} alt={post.alt} />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className={styles.navigation}>
          <button
            className={`${styles.navButton} ${currentIndex === 0 ? styles.navDisabled : ''}`}
            aria-label="Previous"
            onClick={prev}
            disabled={currentIndex === 0}
          >
            <svg viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1L1 7L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ left: `${progress * (100 - 100 / (maxIndex + 1))}%`, width: `${100 / (maxIndex + 1)}%` }}
            />
          </div>
          <button
            className={`${styles.navButton} ${currentIndex === maxIndex ? styles.navDisabled : ''}`}
            aria-label="Next"
            onClick={next}
            disabled={currentIndex === maxIndex}
          >
            <svg viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L6 7L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
