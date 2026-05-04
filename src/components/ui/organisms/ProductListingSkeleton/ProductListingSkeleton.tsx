import styles from './ProductListingSkeleton.module.css';

interface ProductListingSkeletonProps {
  cardCount?: number;
}

export default function ProductListingSkeleton({ cardCount = 6 }: ProductListingSkeletonProps) {
  return (
    <section className="container mt-100 mb-100" aria-hidden="true">
      <div className={styles.heading} />
      <div className={styles.description} />

      <div className={styles.toolbar}>
        <div className={styles.filterBtn} />
        <div className={styles.sortBox} />
      </div>

      <div className={styles.grid}>
        {Array.from({ length: cardCount }).map((_, index) => (
          <article key={index} className={styles.card}>
            <div className={styles.image} />
            <div className={styles.title} />
            <div className={styles.line} />
            <div className={`${styles.line} ${styles.lineShort}`} />
            <div className={styles.button} />
          </article>
        ))}
      </div>
    </section>
  );
}
