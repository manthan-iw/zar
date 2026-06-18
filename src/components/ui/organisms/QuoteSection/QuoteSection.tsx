import Image from 'next/image';
import { imagePath } from '@/lib/imagePath';
import styles from './QuoteSection.module.css';

const stats = [
  {
    value: '60+',
    label: 'Years of Excellence',
    description: 'Six decades of crafting gold bangles with precision and passion.',
  },
  {
    value: '500+',
    label: 'Retail Partners',
    description: 'Trusted by leading jewellers and retailers across India.',
  },
  {
    value: '10M+',
    label: 'Bangles Crafted',
    description: 'Millions of bangles, each carrying the Zar promise of quality.',
  },
];

export default function QuoteSection() {
  return (
    <section className={styles.section}>
      <div className={styles.background}>
        <div className={styles.bgImage}>
          <Image
            src={imagePath("/images/quote-bg.svg")}
            alt="Craftsman at work"
            fill
            sizes="100vw"
          />
        </div>
        <div className={styles.bgOverlay} />
        <div className={styles.content}>
          <div className={styles.quoteWrapper}>
            <span className={styles.quoteMarkLeft}>&ldquo;</span>
            <p className={styles.quoteText}>Excellence is not a skill, it&apos;s an attitude</p>
            <span className={styles.quoteMarkRight}>&rdquo;</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <div>
                  <p className={styles.statValue}>{stat.value}</p>
                  <p className={styles.statLabel}>{stat.label}</p>
                </div>
                <p className={styles.statDescription}>{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
