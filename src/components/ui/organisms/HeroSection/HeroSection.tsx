'use client';

import type { CSSProperties } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/atoms/Button/Button';
import EnquiryModal from '@/components/ui/organisms/EnquiryModal/EnquiryModal';
import { HERO_SLIDES } from '@/lib/data/heroSlider';
import styles from './HeroSection.module.css';

type Direction = 'next' | 'prev';

interface TransitionState {
  fromIndex: number;
  toIndex: number;
  direction: Direction;
}

const AUTOPLAY_DELAY = 5000;
const TRANSITION_MS = 900;

function getTranslateFactor(direction: Direction): number {
  if (typeof window !== 'undefined' && window.innerWidth <= 767) {
    return direction === 'next' ? 160 : 120;
  }

  return direction === 'next' ? 230 : 170;
}

function getNextIndex(current: number, direction: Direction): number {
  if (direction === 'next') {
    return (current + 1) % HERO_SLIDES.length;
  }

  return (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
}

export default function HeroSection() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState<TransitionState | null>(null);
  const isAnimatingRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeSlide = HERO_SLIDES[currentIndex];

  const contentStyle = useMemo(
    () =>
      ({
        '--title-delay': `${activeSlide.contentTiming.titleDelay}ms`,
        '--title-duration': `${activeSlide.contentTiming.titleDuration}ms`,
        '--subtitle-delay': `${activeSlide.contentTiming.subtitleDelay}ms`,
        '--subtitle-duration': `${activeSlide.contentTiming.subtitleDuration}ms`,
        '--button-delay': `${activeSlide.contentTiming.buttonDelay}ms`,
        '--button-duration': `${activeSlide.contentTiming.buttonDuration}ms`,
      }) as CSSProperties,
    [activeSlide],
  );

  const navigate = useCallback(
    (direction: Direction, explicitIndex?: number) => {
      if (isAnimatingRef.current) {
        return;
      }

      const nextIndex =
        explicitIndex === undefined ? getNextIndex(currentIndex, direction) : explicitIndex;

      if (nextIndex === currentIndex || nextIndex < 0 || nextIndex >= HERO_SLIDES.length) {
        return;
      }

      if (reducedMotionRef.current) {
        setCurrentIndex(nextIndex);
        return;
      }

      isAnimatingRef.current = true;
      setTransition({
        fromIndex: currentIndex,
        toIndex: nextIndex,
        direction,
      });

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = setTimeout(() => {
        setCurrentIndex(nextIndex);
        setTransition(null);
        isAnimatingRef.current = false;
      }, TRANSITION_MS);
    },
    [currentIndex],
  );

  const goTo = useCallback(
    (index: number) => {
      if (index === currentIndex) {
        return;
      }

      const direction: Direction = index > currentIndex ? 'next' : 'prev';
      navigate(direction, index);
    },
    [currentIndex, navigate],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReducedMotion = () => {
      reducedMotionRef.current = mediaQuery.matches;
    };

    updateReducedMotion();
    mediaQuery.addEventListener('change', updateReducedMotion);

    return () => {
      mediaQuery.removeEventListener('change', updateReducedMotion);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        navigate('prev');
      }

      if (event.key === 'ArrowRight') {
        navigate('next');
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      navigate('next');
    }, AUTOPLAY_DELAY);

    return () => {
      clearInterval(interval);
    };
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const transitionData = useMemo(() => {
    if (!transition) {
      return null;
    }

    const fromSlide = HERO_SLIDES[transition.fromIndex];
    const toSlide = HERO_SLIDES[transition.toIndex];
    const tf = getTranslateFactor(transition.direction);
    const isVertical = fromSlide.orientation === 'vertical';

    const slice1Transform = isVertical
      ? `translateX(-${tf}%) rotate(${fromSlide.slice1Rotation}deg) scale(${fromSlide.slice1Scale})`
      : `translateY(-${tf}%) rotate(${fromSlide.slice1Rotation}deg) scale(${fromSlide.slice1Scale})`;

    const slice2Transform = isVertical
      ? `translateX(${tf}%) rotate(${fromSlide.slice2Rotation}deg) scale(${fromSlide.slice2Scale})`
      : `translateY(${tf}%) rotate(${fromSlide.slice2Rotation}deg) scale(${fromSlide.slice2Scale})`;

    return {
      fromSlide,
      toSlide,
      style: {
        '--duration': `${TRANSITION_MS}ms`,
        '--slice1-transform': slice1Transform,
        '--slice2-transform': slice2Transform,
      } as CSSProperties,
    };
  }, [transition]);

  return (
    <section className={styles.hero} aria-label="Homepage hero slider">
      <div className={styles.stage}>
        <div className={styles.slide}>
          <div className={styles.backgroundImage}>
            <Image
              src={activeSlide.image}
              alt={activeSlide.alt}
              fill
              sizes="100vw"
              priority={currentIndex === 0}
            />
            <div className={styles.overlay} />
          </div>
          <div className={styles.content}>
            <div
              key={activeSlide.id}
              className={`${styles.contentInner} ${transition ? styles.contentExiting : styles.contentEntering}`}
              style={contentStyle}
            >
              <div className={styles.textBlock}>
                <h1 className={`${styles.heading} ${styles.headingEnter}`}>
                  {activeSlide.heading.split('\n').map((line, index) => (
                    <span key={line}>
                      {line}
                      {index < activeSlide.heading.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </h1>
                <p className={`${styles.subtitle} ${styles.subtitleEnter}`}>{activeSlide.subtitle}</p>
              </div>
              <div className={styles.buttonWrap}>
                <Button variant="outline" showArrow onClick={() => setEnquiryOpen(true)}>
                  Enquire Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {transitionData ? (
          <div className={styles.transitionLayer} style={transitionData.style} aria-hidden="true">
            <div className={styles.nextSlide}>
              <Image src={transitionData.toSlide.image} alt="" fill sizes="100vw" />
              <div className={styles.overlay} />
            </div>

            <div
              className={`${styles.slices} ${
                transitionData.fromSlide.orientation === 'vertical'
                  ? styles.slicesVertical
                  : styles.slicesHorizontal
              }`}
            >
              <div className={`${styles.slice} ${styles.sliceOne}`}>
                <div className={styles.sliceMedia}>
                  <Image src={transitionData.fromSlide.image} alt="" fill sizes="100vw" />
                </div>
              </div>
              <div className={`${styles.slice} ${styles.sliceTwo}`}>
                <div className={styles.sliceMedia}>
                  <Image src={transitionData.fromSlide.image} alt="" fill sizes="100vw" />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* <div className={styles.dots}>
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
          />
        ))}
      </div> */}

      <div className={styles.heroNav}>
        <button
          className={styles.heroNavBtn}
          onClick={() => navigate('prev')}
          aria-label="Previous slide"
        >
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="-0.75"
              y="0.75"
              width="70.5"
              height="70.5"
              rx="35.25"
              transform="matrix(-1 0 0 1 70.5 0)"
              stroke="#A38274"
              strokeWidth="1.5"
            />
            <path
              d="M42.258 48.1166L29.742 35.6006L42.258 23.8828"
              stroke="#A38274"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className={styles.heroNavBtn}
          onClick={() => navigate('next')}
          aria-label="Next slide"
        >
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="0.75"
              y="0.75"
              width="70.5"
              height="70.5"
              rx="35.25"
              fill="none"
              stroke="#A38274"
              strokeWidth="1.5"
            />
            <path
              d="M29.7419 48.1166L42.2579 35.6006L29.7419 23.8828"
              stroke="#A38274"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </section>
  );
}
