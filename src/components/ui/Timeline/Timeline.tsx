'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Timeline.module.css';
import { imagePath } from '@/lib/imagePath';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  image: string;
}

const timelineData: TimelineItem[] = [
  {
    year: '1920',
    title: '1920',
    description: 'The journey begins with Girdharlal & Bros, focusing on specialised gold bangle manufacturing.',
    image: '/images/about/about_5.webp',
  },
  {
    year: '1930',
    title: '1930',
    description: 'The journey begins with Girdharlal & Bros, focusing on specialised gold bangle manufacturing.',
    image: '/images/about/about_5.webp',
  },
  {
    year: '1940',
    title: '1940',
    description: 'The journey begins with Girdharlal & Bros, focusing on specialised gold bangle manufacturing.',
    image: '/images/about/about_5.webp',
  },
  {
    year: '1950',
    title: '1950',
    description: 'The journey begins with Girdharlal & Bros, focusing on specialised gold bangle manufacturing.',
    image: '/images/about/about_5.webp',
  },
  {
    year: '1975',
    title: '1975',
    description: 'Expansion of craftsmanship techniques and establishing a reputation for quality across the region.',
    image: '/images/about/about_5.webp',
  },
  {
    year: '2007',
    title: '2007',
    description: 'Modernisation of manufacturing processes while preserving traditional artistry and heritage.',
    image: '/images/about/about_5.webp',
  },
  {
    year: '2020',
    title: '2020',
    description: 'ZAR is born — a modern brand built on heritage, precision, and innovation in gold bangle design.',
    image: '/images/about/about_5.webp',
  },
  {
    year: '2021',
    title: '2021',
    description: 'ZAR establishes itself as a leader in gold bangle manufacturing, serving partners across India.',
    image: '/images/about/about_5.webp',
  },
];

export default function Timeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = timelineData[activeIndex];

  return (
    <section className={styles.timelineSection}>
      <div className="container">
        <h2 className={styles.title}>THE ZAR JOURNEY</h2>
        <p className={styles.subtitle}>A journey shaped by craftsmanship, innovation, and growth.</p>

        <div className={styles.timelineWrapper}>
          {/* Year list */}
          <div className={styles.yearList}>
            {timelineData.map((item, index) => (
              <button
                key={item.year}
                className={`${styles.yearButton} ${index === activeIndex ? styles.yearButtonActive : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                {item.year}
              </button>
            ))}
          </div>

          {/* Image */}
          <div className={styles.imageWrapper}>
            <Image
              src={imagePath(activeItem.image)}
              alt={`ZAR journey - ${activeItem.year}`}
              fill
              className={styles.timelineImage}
            />
          </div>

          {/* Description */}
          <div className={styles.contentBlock}>
            <h3 className={styles.contentYear}>{activeItem.title}</h3>
            <p className={styles.contentDescription}>{activeItem.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
