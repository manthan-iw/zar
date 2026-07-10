'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { apiGet, API_BASE_URL } from '@/lib/api/axios';
import { getImageUrl } from '@/lib/utils';
import { imagePath } from '@/lib/imagePath';
import styles from './RetailerSlider.module.css';

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
const PlayIcon = () => (
  <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="36"
      cy="36"
      r="35"
      fill="rgba(255,255,255,0.15)"
      stroke="rgba(255,255,255,0.65)"
      strokeWidth="1.2"
    />
    <polygon points="29,20 55,36 29,52" fill="white" />
  </svg>
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Testimonial {
  poster: string;
  video: string;
  quote: string;
  name: string;
  designation: string;
}

interface ApiRetailerTestimonial {
  video_link?: string;
  fallback_image?: string;
  title?: string;
  name?: string;
  designation?: string;
  description?: string;
}

interface RetailerApiResponse {
  success?: boolean;
  data?: ApiRetailerTestimonial[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function resolveRetailerTestimonial(item: ApiRetailerTestimonial): Testimonial {
  const rawVideo = item.video_link?.trim() || '';
  const normalizedVideo = rawVideo && !/^https?:\/\//i.test(rawVideo)
    ? `${API_BASE_URL.replace(/\/+$/, '')}/${rawVideo.replace(/^\/+/, '')}`
    : rawVideo;

  return {
    poster: getImageUrl(item.fallback_image || ''),
    video: normalizedVideo,
    quote: item.description?.trim() || '',
    name: item.name?.trim() || item.title?.trim() || 'Retailer',
    designation: item.designation?.trim() || '',
  };
}

/**
 * FIX #6 — broadened check: match mp4/webm/ogg anywhere in the URL
 * (handles query-params, redirect URLs, etc.)
 */
function isPlayableVideo(url: string): boolean {
  return /mp4|webm|ogg/i.test(url);
}

const skeletonCards = Array.from({ length: 3 });

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function RetailerSlider() {
  const swiperRef = useRef<SwiperType | null>(null);

  // FIX #7 — track active slide index from Swiper state, not DOM class
  const activeIndexRef = useRef<number>(0);

  // FIX #5 — initialise skeleton state as false (not loaded) and sync with data
  const [sliderTestimonials, setSliderTestimonials] = useState<Testimonial[]>([]);
  const [loadedVideos, setLoadedVideos] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skeletonTarget, setSkeletonTarget] = useState(3);

  const showSkeleton = isLoading;

  // FIX #5 — sync loadedVideos length whenever sliderTestimonials changes
  useEffect(() => {
    setLoadedVideos(sliderTestimonials.map((testimonial) => !isPlayableVideo(testimonial.video)));
  }, [sliderTestimonials]);

  useEffect(() => {
    const updateSkeletonTarget = debounce(() => {
      if (window.innerWidth <= 767) {
        setSkeletonTarget(1);
        return;
      }
      if (window.innerWidth <= 1199) {
        setSkeletonTarget(2);
        return;
      }
      setSkeletonTarget(3);
    }, 150);

    async function fetchRetailerTestimonials() {
      try {
        const json = await apiGet<RetailerApiResponse>('/api/retailer-testimonials');

        if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
          const remoteTestimonials = json.data
             .map(resolveRetailerTestimonial)
             .filter((item) => item.name && (item.quote || item.video));

          if (remoteTestimonials.length > 0) {
            let finalTestimonials = [...remoteTestimonials];
            // Ensure we have at least 6 slides so Swiper loop works flawlessly
            // and always shows 3 cards (left, center, right) without blank spaces.
            while (finalTestimonials.length < 6) {
              finalTestimonials = [...finalTestimonials, ...remoteTestimonials];
            }
            setSliderTestimonials(finalTestimonials);
          }
        }
      } catch (error) {
        console.error('RetailerSlider fetch failed:', error);
      } finally {
        setIsLoading(false);
      }
    }

    // Initial check (immediate)
    if (window.innerWidth <= 767) {
      setSkeletonTarget(1);
    } else if (window.innerWidth <= 1199) {
      setSkeletonTarget(2);
    } else {
      setSkeletonTarget(3);
    }

    void fetchRetailerTestimonials();
    window.addEventListener('resize', updateSkeletonTarget);
    return () => {
      window.removeEventListener('resize', updateSkeletonTarget);
      updateSkeletonTarget.cancel();
    };
  }, []);

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------
  function markVideoLoaded(idx: number) {
    setLoadedVideos((current) => {
      if (current[idx]) return current;
      const next = [...current];
      next[idx] = true;
      return next;
    });
  }

  /**
   * FIX #3 — stopAll now resumes autoplay after pausing videos.
   * Called on every slide change so autoplay is always restored.
   */
  const stopAll = useCallback(() => {
    if (!swiperRef.current || !swiperRef.current.el) return;
    const slides = swiperRef.current.el.querySelectorAll('.swiper-slide');
    slides.forEach((slide) => {
      const v = slide.querySelector('video') as HTMLVideoElement | null;
      if (v) {
        v.pause();
        v.currentTime = 0;
        v.removeAttribute('controls');
      }
      const w = slide.querySelector(`.${styles.vwrap}`);
      if (w) {
        w.classList.remove(styles.playing);
      }
    });
    // Resume autoplay that may have been stopped during video playback
    swiperRef.current?.autoplay?.start();
  }, []);

  /**
   * FIX #2 — stop autoplay when a video starts; resume when it's paused/ended.
   * Updated to use DOM traversal to support Swiper loop clones.
   */
  function handlePlay(e: React.MouseEvent<HTMLDivElement>, testimonial: Testimonial) {
    const slide = e.currentTarget.closest('.swiper-slide');
    if (!slide) return;

    const v = slide.querySelector('video') as HTMLVideoElement | null;
    const w = slide.querySelector(`.${styles.vwrap}`);

    const hasPlayableSource = isPlayableVideo(testimonial.video);
    if (!v || !hasPlayableSource) {
      if (testimonial.video) window.open(testimonial.video, '_blank');
      return;
    }

    if (v.paused) {
      // Stop all other playing videos first
      if (swiperRef.current && swiperRef.current.el) {
        const allSlides = swiperRef.current.el.querySelectorAll('.swiper-slide');
        allSlides.forEach((s) => {
          if (s === slide) return; // skip current
          const otherV = s.querySelector('video') as HTMLVideoElement | null;
          if (otherV) {
            otherV.pause();
            otherV.currentTime = 0;
            otherV.removeAttribute('controls');
          }
          const otherW = s.querySelector(`.${styles.vwrap}`);
          if (otherW) {
            otherW.classList.remove(styles.playing);
          }
        });
      }

      const playPromise = v.play();
      if (playPromise instanceof Promise) {
        playPromise.catch((error) => {
          console.warn('RetailerSlider video play failed:', error);
          v.removeAttribute('controls');
          w?.classList.remove(styles.playing);
          swiperRef.current?.autoplay?.start();
          if (testimonial.video) window.open(testimonial.video, '_blank');
        });
      }

      v.setAttribute('controls', '');
      w?.classList.add(styles.playing);

      // Stop slider autoplay while video is playing
      swiperRef.current?.autoplay?.stop();
    } else {
      v.pause();
      v.removeAttribute('controls');
      w?.classList.remove(styles.playing);

      // Resume autoplay once user pauses the video
      swiperRef.current?.autoplay?.start();
    }
  }



  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <section className="mt-100 mb-100">
      <div className={styles.hd}>
        <h2 className="fs_54">What Our Distributor Say</h2>
        <p>Hear from our partners about their journey through our exclusive showcases.</p>
      </div>

      <div
        className={styles.outer}
        // FIX #1 — single source of truth for hover pause/resume.
        // Removed pauseOnMouseEnter from Swiper config; handled only here.
        onMouseEnter={() => swiperRef.current?.autoplay?.pause()}
        onMouseLeave={() => swiperRef.current?.autoplay?.resume()}
      >
        {showSkeleton ? (
          <div className={styles.skeletonOverlay} aria-hidden="true">
            <div className={styles.skeletonGrid}>
              {skeletonCards.map((_, idx) => (
                <article key={idx} className={styles.skeletonCard}>
                  <div className={styles.skeletonCardMedia}>
                    <div className={styles.skeletonPlay} />
                    <div className={styles.skeletonShimmer} />
                  </div>
                  <div className={styles.skeletonCardContent}>
                    <div className={styles.skeletonCardQuote} />
                    <div className={styles.skeletonCardLine} />
                    <div className={`${styles.skeletonCardLine} ${styles.skeletonCardLineWide}`} />
                    <div className={`${styles.skeletonCardLine} ${styles.skeletonCardLineShort}`} />
                    <div className={styles.skeletonCardMeta} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay]}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              // FIX #1 — removed pauseOnMouseEnter here; outer div handles it
              pauseOnMouseEnter: false,
              reverseDirection: false,
            }}
            centeredSlides={true}
            slideToClickedSlide={true}
            slidesPerView={3}
            spaceBetween={50}
            speed={800}
            grabCursor
            breakpoints={{
              0:    { slidesPerView: 1, spaceBetween: 20 },
              768:  { slidesPerView: 2, spaceBetween: 24 },
              1280: { slidesPerView: 3, spaceBetween: 30 },
              1441: { slidesPerView: 3, spaceBetween: 30 },
            }}
            onSwiper={(s) => {
              swiperRef.current = s;
            }}
            // FIX #7 — track real active index from Swiper
            onActiveIndexChange={(s) => {
              activeIndexRef.current = s.realIndex;
            }}
            // FIX #3 — stopAll (which also resumes autoplay) on every slide change
            onSlideChange={stopAll}
            className={styles.swiper}
          >
            {sliderTestimonials.map((t, idx) => (
              <SwiperSlide
                key={idx}
                className={styles.slide}
              >
                {/* Video wrapper */}
                <div
                  className={styles.vwrap}
                >
                  <img
                    src={t.poster}
                    alt={`${t.name} testimonial poster`}
                    className={styles.poster}
                    draggable="false"
                  />
                  <video
                    // FIX #6 — broadened isPlayableVideo catches more URL formats
                    src={isPlayableVideo(t.video) ? t.video : undefined}
                    poster={t.poster}
                    loop
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={() => markVideoLoaded(idx)}
                    onLoadedData={() => markVideoLoaded(idx)}
                    onCanPlay={() => markVideoLoaded(idx)}
                    onError={() => markVideoLoaded(idx)}
                    onPause={(e) => {
                      // Don't remove playing class if the video simply ended
                      if (!e.currentTarget.ended) {
                        e.currentTarget.closest(`.${styles.vwrap}`)?.classList.remove(styles.playing);
                      }
                    }}
                    onPlay={(e) => e.currentTarget.closest(`.${styles.vwrap}`)?.classList.add(styles.playing)}
                    onEnded={(e) => {
                      e.currentTarget.removeAttribute('controls');
                      e.currentTarget.closest(`.${styles.vwrap}`)?.classList.remove(styles.playing);
                      // FIX #2 — resume autoplay when video finishes
                      swiperRef.current?.autoplay?.start();
                    }}
                  />

                  {/* Play button */}
                  <div
                    className={styles.pbtn}
                    onClick={(e) => {
                      e.stopPropagation(); // prevent slide-click from firing
                      handlePlay(e, t);
                    }}
                  >
                    <PlayIcon />
                  </div>
                </div>

                {/* Content panel */}
                <div className={styles.slideBody}>
                  <div className={styles.slideBodyInner}>
                    {t.quote && (
                      <>
                        <Image
                          src={imagePath("/images/quote_2.svg")}
                          alt="quote"
                          width={54}
                          height={40}
                          className={styles.quoteImg}
                        />
                        <p className={styles.message}>{t.quote}</p>
                      </>
                    )}
                    <span className={styles.name} style={!t.quote ? { marginTop: '30px' } : undefined}>{t.name}</span>
                    <span className={styles.designation}>{t.designation}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}