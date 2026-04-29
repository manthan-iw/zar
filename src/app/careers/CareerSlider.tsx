"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import styles from './CareerSlider.module.css';

const skeletonCards = Array.from({ length: 3 });

export default function CareerSlider() {
  const slides = [
    '/images/career/career3.webp',
    '/images/career/career4.webp',
    '/images/career/career5.webp',
    '/images/career/career2.webp',
    '/images/career/career3.webp',
    '/images/career/career4.webp',
    '/images/career/career5.webp',
    '/images/career/career2.webp',
  ];

  const [loadedImages, setLoadedImages] = useState<boolean[]>(() =>
    slides.map(() => false)
  );

  const showSkeleton = loadedImages.slice(0, 3).some((loaded) => !loaded);

  function markLoaded(idx: number) {
    setLoadedImages((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  }

  return (
    <section className={`mt-100 ${styles.careerSliderSection}`}>
      {showSkeleton && (
        <div className={styles.skeletonGrid} aria-hidden="true">
          {skeletonCards.map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonShimmer} />
            </div>
          ))}
        </div>
      )}
      <Swiper
        className={`${styles.careerSwiper} ${showSkeleton ? styles.swiperLoading : ''}`}
        modules={[Autoplay]}
        spaceBetween={30}
        slidesPerView={3}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 3000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 2.5,
            spaceBetween: 30,
          },
        }}
      >
        {slides.map((src, index) => (
          <SwiperSlide key={index} className={styles.careerSlide}>
            <div className={styles.imageWrapper}>
              <Image 
                src={src} 
                alt={`Career at Zar Jewels ${index + 1}`} 
                fill 
                style={{ objectFit: 'cover' }}
                onLoad={() => markLoaded(index)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
