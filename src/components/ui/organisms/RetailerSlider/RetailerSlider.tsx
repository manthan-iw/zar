'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './RetailerSlider.module.css';

const PlayIcon = () => (
  <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="36" r="35" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.65)" strokeWidth="1.2" />
    <polygon points="29,20 55,36 29,52" fill="white" />
  </svg>
);

interface Testimonial {
  video: string;
  quote: string;
  name: string;
  designation: string;
}

const baseTestimonials: Testimonial[] = [
  {
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    quote: "The bangles I found at the expo were exactly what I'd been searching for. The craftsmanship is truly world-class.",
    name: 'Priya Sharma',
    designation: 'Bridal Client, Mumbai',
  },
  {
    video: 'https://www.w3schools.com/html/movie.mp4',
    quote: "Every piece feels curated with intention. Our customers keep coming back for the exclusivity this platform provides.",
    name: 'Ananya Mehta',
    designation: 'Boutique Director, Delhi',
  },
  {
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    quote: "Partnering with them transformed our store. The quality of their jewellery collection is simply unmatched in the market.",
    name: 'Rekha Nair',
    designation: 'Jewellery Store Owner, Kochi',
  },
  {
    video: 'https://www.w3schools.com/html/movie.mp4',
    quote: "The designs speak to our heritage beautifully. I have never seen my clients so excited about a new collection.",
    name: 'Sunita Joshi',
    designation: 'Heritage Curator, Jaipur',
  },
  {
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    quote: "The bangles I found at the expo were exactly what I'd been searching for. The craftsmanship is truly world-class.",
    name: 'Priya Sharma',
    designation: 'Bridal Client, Mumbai',
  },
  {
    video: 'https://www.w3schools.com/html/movie.mp4',
    quote: "Every piece feels curated with intention. Our customers keep coming back for the exclusivity this platform provides.",
    name: 'Ananya Mehta',
    designation: 'Boutique Director, Delhi',
  },
  {
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    quote: "Partnering with them transformed our store. The quality of their jewellery collection is simply unmatched in the market.",
    name: 'Rekha Nair',
    designation: 'Jewellery Store Owner, Kochi',
  },
  {
    video: 'https://www.w3schools.com/html/movie.mp4',
    quote: "The designs speak to our heritage beautifully. I have never seen my clients so excited about a new collection.",
    name: 'Sunita Joshi',
    designation: 'Heritage Curator, Jaipur',
  },
];

const testimonials: Testimonial[] = [...baseTestimonials];
const skeletonCards = Array.from({ length: 3 });

export default function RetailerSlider() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const wrapRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const swiperRef = useRef<SwiperType | null>(null);
  const [skeletonTarget, setSkeletonTarget] = useState(3);
  const [loadedVideos, setLoadedVideos] = useState<boolean[]>(() =>
    testimonials.map(() => true)
  );
  const showSkeleton = loadedVideos.slice(0, skeletonTarget).some((loaded) => !loaded);

  useEffect(() => {
    function updateSkeletonTarget() {
      if (window.innerWidth <= 767) {
        setSkeletonTarget(1);
        return;
      }

      if (window.innerWidth <= 1199) {
        setSkeletonTarget(2);
        return;
      }

      setSkeletonTarget(3);
    }

    updateSkeletonTarget();
    window.addEventListener('resize', updateSkeletonTarget);

    return () => {
      window.removeEventListener('resize', updateSkeletonTarget);
    };
  }, []);

  function markVideoLoaded(idx: number) {
    setLoadedVideos((current) => {
      if (current[idx]) {
        return current;
      }

      const next = [...current];
      next[idx] = true;
      return next;
    });
  }

  function stopAll() {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      v.pause();
      v.currentTime = 0;
      v.removeAttribute('controls');
      wrapRefs.current[i]?.classList.remove(styles.playing);
    });
  }

  function handlePlay(idx: number) {
    const v = videoRefs.current[idx];
    const w = wrapRefs.current[idx];
    if (!v || !w) return;
    if (v.paused) {
      v.play();
      v.setAttribute('controls', '');
      w.classList.add(styles.playing);
    } else {
      v.pause();
      v.removeAttribute('controls');
      w.classList.remove(styles.playing);
    }
  }

  function handleSlideClick(e: React.MouseEvent, idx: number) {
    const sw = swiperRef.current;
    if (!sw) return;
    // Only navigate if clicking a non-active slide
    const el = (e.currentTarget as HTMLElement);
    if (!el.classList.contains('swiper-slide-active')) {
      stopAll();
      sw.slideToLoop(idx % testimonials.length);
    }
  }

  return (
    <section className="mt-100 mb-100">
      <div className={styles.hd}>
        <h2 className="fs_54">What Our Retailers / End Customers Say</h2>
        <p>Hear from our partners about their journey through our exclusive showcases.</p>
      </div>

      <div 
        className={styles.outer}
        onMouseEnter={() => swiperRef.current?.autoplay?.pause()}
        onMouseLeave={() => swiperRef.current?.autoplay?.resume()}
      >
        {showSkeleton && (
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
        )}
        <Swiper
          modules={[Autoplay]}
          loop={true}
          // autoplay={{
          //   delay: 3000,
          //   disableOnInteraction: false,
          //   pauseOnMouseEnter: true,
          //   reverseDirection: true,
          // }}
          centeredSlides={true}
          slidesPerView={3}
          spaceBetween={50}
          speed={600}
          grabCursor
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1200: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
          }}
          onSwiper={(s) => { swiperRef.current = s; }}
          onSlideChange={stopAll}
          className={`${styles.swiper} ${showSkeleton ? styles.swiperLoading : ''}`}
        >
          {testimonials.map((t, idx) => (
            <SwiperSlide
              key={idx}
              className={styles.slide}
              onClick={(e) => handleSlideClick(e, idx)}
            >
              {/* Video wrapper */}
              <div
                className={styles.vwrap}
                ref={(el) => { wrapRefs.current[idx] = el; }}
              >
                <video
                  ref={(el) => { videoRefs.current[idx] = el; }}
                  // src={t.video}
                  poster="/images/Distributor-Testimonials.png"
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={() => markVideoLoaded(idx)}
                  onCanPlay={() => markVideoLoaded(idx)}
                  onPause={(e) => {
                    if (!e.currentTarget.ended) wrapRefs.current[idx]?.classList.remove(styles.playing);
                  }}
                  onPlay={() => wrapRefs.current[idx]?.classList.add(styles.playing)}
                  onEnded={() => {
                    videoRefs.current[idx]?.removeAttribute('controls');
                    wrapRefs.current[idx]?.classList.remove(styles.playing);
                  }}
                />
                {/* Play button */}
                <div
                  className={styles.pbtn}
                  onClick={(e) => { e.stopPropagation(); handlePlay(idx); }}
                >
                  <PlayIcon />
                </div>
              </div>

              {/* Content panel */}
              <div className={styles.slideBody}>
                <div className={styles.slideBodyInner}>
                  <Image
                    src="/images/quote_2.svg"
                    alt="quote"
                    width={54}
                    height={40}
                    className={styles.quoteImg}
                  />
                  <p className={styles.message}>{t.quote}</p>
                  <span className={styles.name}>{t.name}</span>
                  <span className={styles.designation}>{t.designation}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
