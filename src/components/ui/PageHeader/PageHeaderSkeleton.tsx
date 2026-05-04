import styles from './PageHeaderSkeleton.module.css';

interface PageHeaderSkeletonProps {
  showBanner?: boolean;
}

export default function PageHeaderSkeleton({ showBanner = true }: PageHeaderSkeletonProps) {
  return (
    <section className={styles.section} aria-hidden="true">
      <div className="container">
        <div className={styles.breadcrumbs} />
        <div className={styles.title} />
      </div>
      {showBanner ? <div className={styles.banner} /> : null}
    </section>
  );
}
