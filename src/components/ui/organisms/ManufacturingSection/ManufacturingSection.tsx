'use client';

import { motion } from 'framer-motion';
import { imagePath } from '@/lib/imagePath';
import Button from '@/components/ui/atoms/Button/Button';
import styles from './ManufacturingSection.module.css';

export default function ManufacturingSection() {
  return (
    <section className={`${styles.section} mt-100`}>
      <motion.video
        className={styles.backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
        poster={imagePath("/images/homepage/video.webp")}
      >
        <source src={imagePath("/images/homepage/manufacturing-video.mp4")} type="video/mp4" />
      </motion.video>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className={styles.heading}>Craftsmanship at Scale</h2>
          <div className={styles.textBlock}>
            <p>
              Rooted in tradition and refined through modern manufacturing, ZAR delivers gold bangles with precision, consistency, and quality at scale.<br />
              As a leading <strong>gold bangle manufacturer</strong>, we combine design expertise with advanced processes to ensure uniformity, finish, and reliability, making us a trusted partner for retailers.
            </p>
            <Button href="/partner" variant="outline" showArrow className={styles.btn1}>
              Become a Partner
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
