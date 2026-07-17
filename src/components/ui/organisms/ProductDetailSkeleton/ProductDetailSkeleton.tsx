import styles from './ProductDetailSkeleton.module.css';

/** Skeleton matching the product detail gallery + info layout. */
export default function ProductDetailSkeleton() {
  return (
    <section className="container mb-100" aria-hidden="true">
      <div className={styles.grid}>
        <div className={styles.gallery}>
          <div className={styles.mainImage} />
          <div className={styles.thumbs}>
            <div className={styles.thumb} />
            <div className={styles.thumb} />
            <div className={styles.thumb} />
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.title} />
          <div className={styles.sku} />
          <div className={styles.line} />
          <div className={styles.line} />
          <div className={`${styles.line} ${styles.lineShort}`} />
          <div className={styles.button} />
        </div>
      </div>
    </section>
  );
}
