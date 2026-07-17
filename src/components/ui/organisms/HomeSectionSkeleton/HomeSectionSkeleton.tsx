import styles from './HomeSectionSkeleton.module.css';

interface HomeSectionSkeletonProps {
  /** Approximate height so layout doesn't jump when the real section mounts. */
  height?: number;
}

/** Shimmer placeholder used as the `loading` fallback for lazy home sections. */
export default function HomeSectionSkeleton({ height = 420 }: HomeSectionSkeletonProps) {
  return (
    <section className={`mt-100 ${styles.section}`} style={{ minHeight: height }} aria-hidden="true">
      <div className="container">
        <div className={styles.title} />
        <div className={styles.line} />
        <div className={`${styles.line} ${styles.lineShort}`} />
        <div className={styles.media} />
      </div>
    </section>
  );
}
