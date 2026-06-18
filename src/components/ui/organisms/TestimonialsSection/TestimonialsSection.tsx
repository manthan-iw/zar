"use client";
// @ts-ignore
import 'swiper/css/navigation';
// @ts-ignore
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { imagePath } from '@/lib/imagePath';
import styles from './TestimonialsSection.module.css';
import { useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';

const testimonials = [
  {
    video: '/images/testimonial-video.svg',
    quote: "The bangles I found at the expo were exactly what I'd been searching for. The craftsmanship is truly world-class.",
    author: 'Priya Sharma',
    role: 'Bridal Client',
  },
  {
    video: '/images/testimonial-video.svg',
    quote: "Zar's collection is unique and the service is exceptional. I recommend them to all my friends!",
    author: 'Amit Patel',
    role: 'Retail Partner',
  },
  {
    video: '/images/testimonial-video.svg',
    quote: 'Every piece tells a story. I am always impressed by the quality and design.',
    author: 'Sunita Rao',
    role: 'Repeat Customer',
  },
  {
    video: '/images/testimonial-video.svg',
    quote: 'The lightweight jewellery collection is perfect for everyday wear. Absolutely love the designs!',
    author: 'Neha Gupta',
    role: 'Fashion Blogger',
  },
  {
    video: '/images/testimonial-video.svg',
    quote: 'As a retailer, partnering with Zar has been one of the best decisions. Their designs sell themselves.',
    author: 'Rajesh Mehta',
    role: 'Jewellery Retailer',
  },
  {
    video: '/images/testimonial-video.svg',
    quote: 'The mangalsutra designs are both modern and traditional. My customers always come back for more.',
    author: 'Kavita Joshi',
    role: 'Store Owner',
  },
  {
    video: '/images/testimonial-video.svg',
    quote: 'Exceptional craftsmanship and timely delivery. Zar has set a new standard in the industry.',
    author: 'Vikram Singh',
    role: 'Wholesale Partner',
  },
];

export default function TestimonialsSection() {
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <section className="mt-100">
      <div className={styles.inner}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="fs_54">What Our Retailers Say</h2>
          <p className="">
            Hear from our patrons about their journey through our exclusive showcases.
          </p>
        </motion.div>
        <motion.div 
          className={styles.testimonialWrapper}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Swiper
            modules={[Autoplay]}
            slidesPerView={3}
            centeredSlides
            loop
            autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            style={{ width: '100%' }}
            onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
            className={styles.testimonialSwiper}
          >
            {testimonials.map((testimonial, idx) => (
              <SwiperSlide key={idx} onClick={() => (swiperRef.current as any)?.slideToLoop(idx)} style={{ cursor: 'pointer' }}>
                {(slideProps: { isActive: boolean }) => (
                  <div className={slideProps.isActive ? styles.centerContent : styles.sideImageContent}>
                    <div className={styles.videoWrapper}>
                      <Image
                        src={imagePath(testimonial.video)}
                        alt="Testimonial video"
                        fill
                        sizes="800px"
                      />
                      <div className={styles.playIcon}>
                        <svg viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 5L55 35L10 65V5Z" />
                        </svg>
                      </div>
                    </div>
                    {slideProps.isActive && (
                      <div className={styles.quoteBlock}>
                        <Image
                          src={imagePath("/images/quote-icon.svg")}
                          alt=""
                          width={54}
                          height={41}
                          className={styles.quoteIcon}
                        />
                        <p className={styles.quoteText}>
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>
                        <div className={styles.authorBlock}>
                          <p className={styles.authorName}>{testimonial.author}</p>
                          <p className={styles.authorRole}>{testimonial.role}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
