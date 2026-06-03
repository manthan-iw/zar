'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './TradeHighlightsSlider.module.css';
import style from '../app/collections/[purity]/[category]/[style]/[id]/page.module.css';
import { getImageUrl } from '@/lib/utils';

export type TradeHighlight = {
  icon: string;
  title: string;
  description: string;
};

interface TradeHighlightsSliderProps {
  highlights: TradeHighlight[];
}

export default function TradeHighlightsSlider({ highlights }: TradeHighlightsSliderProps) {
  return (
    <section className={styles.tradeHighlightsMobile} aria-label="Trade highlights slider">
      <div className="container">
        <div className={styles.tradeHighlightsSliderWrap}>
          <Swiper
            spaceBetween={16}
            slidesPerView={1}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className={styles.tradeHighlightsSlider}
          >
            {highlights.map((item) => (
              <SwiperSlide key={item.title}>
                <article className={style.highlightCard}>
                  <div className={style.highlightIcon} aria-hidden="true">
                    <img src={getImageUrl(item.icon)} alt="" />
                  </div>
                  <h3 className={style.highlightTitle}>{item.title}</h3>
                  <p
                  className={style.highlightDescription}
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
