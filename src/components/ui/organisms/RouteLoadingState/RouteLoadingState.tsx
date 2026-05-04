import styles from './RouteLoadingState.module.css';

interface RouteLoadingStateProps {
  message?: string;
}

export default function RouteLoadingState({ message }: RouteLoadingStateProps) {
  return (
    <section className={styles.section} aria-busy="true" aria-live="polite">
      <div className={styles.container}>
        <div className={styles.skeletonGrid} aria-hidden="true">
          {[...Array(3)].map((_, index) => (
            <article key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonLine} />
              <div className={`${styles.skeletonLine} ${styles.skeletonLineWide}`} />
            </article>
          ))}
        </div>
      </div>
      <span className={styles.srOnly}>{message || 'Loading content'}</span>
    </section>
  );
}
