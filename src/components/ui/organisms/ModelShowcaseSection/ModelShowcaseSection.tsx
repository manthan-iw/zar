'use client';

import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Button from '@/components/ui/atoms/Button/Button';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import styles from './ModelShowcaseSection.module.css';

const models = [
  { name: 'Dazzling-1', src: '/images/models/ZAR-1.glb', alt: 'Interactive 3D jewellery model 1', poster: '/images/homepage/product_1.webp' },
  { name: 'Dazzling-2', src: '/images/models/ZAR-2.glb', alt: 'Interactive 3D jewellery model 2', poster: '/images/homepage/product_2.webp' },
  { name: 'Dazzling-3', src: '/images/models/ZAR-3.glb', alt: 'Interactive 3D jewellery model 3', poster: '/images/homepage/product_3.webp' },
  { name: 'Dazzling-4', src: '/images/models/ZAR-4.glb', alt: 'Interactive 3D jewellery model 4', poster: '/images/homepage/product_4.webp' },
  { name: 'Dazzling-1', src: '/images/models/ZAR-1.glb', alt: 'Interactive 3D jewellery model 1', poster: '/images/homepage/product_1.webp' },
  { name: 'Dazzling-2', src: '/images/models/ZAR-2.glb', alt: 'Interactive 3D jewellery model 2', poster: '/images/homepage/product_2.webp' },
  { name: 'Dazzling-3', src: '/images/models/ZAR-3.glb', alt: 'Interactive 3D jewellery model 3', poster: '/images/homepage/product_3.webp' },
  { name: 'Dazzling-4', src: '/images/models/ZAR-4.glb', alt: 'Interactive 3D jewellery model 4', poster: '/images/homepage/product_4.webp' },
];

const ArrowIcon = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.75" y="0.75" width="70.5" height="70.5" rx="35.25" fill="white" />
    <rect x="0.75" y="0.75" width="70.5" height="70.5" rx="35.25" stroke="#A38274" strokeWidth="1.5" />
    <path d="M29.7419 48.1166L42.2579 35.6006L29.7419 23.8828" stroke="#A38274" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ModelShowcaseSection() {
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    import('@google/model-viewer');
  }, []);

  return (
    <section className="mt-100" aria-labelledby="model-showcase-title">
      <div className="container">
        <header className={styles.header}>
          <h2 id="model-showcase-title" className="fs_54">Signature Gold Bangles</h2>
          <p className="">
            Discover a range of thoughtfully curated designs that balance tradition and modernity.
          </p>
          <Button href="javascript:void(0)" variant="primary" showArrow>
            Explore Collections
          </Button>
        </header>

        <div className={styles.sliderWrapper}>
          <button
            className={`${styles.navBtn} ${styles.navPrev}`}
            aria-label="Previous slide"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ArrowIcon />
          </button>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            allowTouchMove={false}
            // autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className={styles.slider}
          >
            {models.map((model, index) => (
              <SwiperSlide key={`${model.src}-${index}`}>
                <article className={styles.card}>
                  <div className={styles.modelWrapper}>
                    <div className={styles.circleBg} aria-hidden="true" />
                    <model-viewer
                      src={model.src}
                      alt={model.alt}
                      poster={model.poster}
                      camera-controls
                      disable-zoom
                      disable-tap
                      max-camera-orbit="auto auto 100%"
                      auto-rotate
                      touch-action="pan-y"
                      interaction-prompt="auto"
                      shadow-intensity="0"
                      exposure="1"
                      loading="lazy"
                      reveal="auto"
                      className={styles.viewer}
                    />
                  </div>
                  <span className={styles.cardLabel}>{model.name}</span>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className={`${styles.navBtn} ${styles.navNext}`}
            aria-label="Next slide"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
