'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { imagePath } from '@/lib/imagePath';
import StatCard from '@/components/ui/atoms/StatCard/StatCard';
import styles from './LegacySection.module.css';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' as const } }
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } }
};

export default function LegacySection() {
  return (
    <section className="mt-100">
      <div className="container">
        <div className={styles.inner}>
          <motion.div 
            className={styles.grid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <div className={styles.imageBlock}>
              <motion.div className={styles.mainImage} variants={imageVariants}>
                <Image
                  src={imagePath("/images/homepage/about_home.png")}
                  alt="Gold bangle craftsmanship"
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </motion.div>            
              <motion.div className={styles.statOverlay} variants={imageVariants}>
                <StatCard value="60+" label="Years of Excellence" animate />
              </motion.div>
            </div>
            <div className={styles.textBlock}>
              <motion.h2 className="fs_54" variants={textVariants}>A Legacy Forged in Gold</motion.h2>
              <motion.div className={styles.paragraphs} variants={textVariants}>
                <p>
                  For over seven decades, ZAR has carried forward a legacy rooted in craftsmanship, trust, and precision. As a leading <strong className="txt_black">gold bangle manufacturer</strong>, the brand brings together generations of expertise with advanced manufacturing and refined design.
                </p>
                <p>
                  Each creation reflects a deep understanding of gold craftsmanship, where tradition meets innovation, and every detail is shaped with purpose. It is this commitment to quality and consistency that continues to define ZAR across markets and generations.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
