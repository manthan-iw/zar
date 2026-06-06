'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/atoms/Button/Button';
import styles from './ExhibitionsSection.module.css';

interface ExhibitionsSectionProps {
  title?: string;
  id?: string;
  showHeader?: boolean;
  showButton?: boolean;
}

export default function ExhibitionsSection({ title = "Upcoming Exhibitions", id, showHeader = true, showButton = true }: ExhibitionsSectionProps) {
  return (
    <section className={styles.section} id={id}>
      <div className={styles.backgroundImage}>
        <Image
          src="/images/homepage/event_bg.webp"
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
        />
      </div>
      <div className={styles.overlay} />
      <div className={styles.inner}>
        {showHeader && (
          <motion.div 
            className={styles.header}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="fs_54 txt_white">{title}</h2>
            <p className="txt_white">
              Discover our latest jewellery showcases and exclusive retail partner events.
            </p>
          </motion.div>
        )}
        <motion.div 
          className={styles.eventCard}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={styles.eventImage}>
            <Image
              src="/images/homepage/event.webp"
              alt="Sharjah Watch and Jewellery Show"
              width={900}
              height={500}              
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
          <div className={styles.eventDetails}>
            <h3 className="fs_30 txt_white">Watch and Jewellery Show Sharjah</h3>
            <div className={styles.eventMeta}>
              <div className={styles.metaItem}>               
                <span>08 Apr - 12 Apr 2026</span>
              </div>
              <div className={styles.metaItem}>
                <svg className={styles.metaIcon} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.75 7.5C15.75 12.75 9 17.25 9 17.25C9 17.25 2.25 12.75 2.25 7.5C2.25 5.70979 2.96116 3.9929 4.22703 2.72703C5.4929 1.46116 7.20979 0.75 9 0.75C10.7902 0.75 12.5071 1.46116 13.773 2.72703C15.0388 3.9929 15.75 5.70979 15.75 7.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Sharjah, UAE</span>
              </div>
            </div>
            <p className={styles.eventDescription}>
              Sharjah Watch and Jewellery Show 2026 is a biannual event that will present the latest jewelry designs, trends in watch collections, and jewelry made up of precious stones and diamonds.
            </p>
            {showButton && (
              <Button href="/event" variant="outline" showArrow>
                View Event
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
