import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import styles from './CollectionGrid.module.css';

interface CollectionItem {
  id: string;
  name: string;
  image: string;
  category?: string;
  href?: string;
}

interface CollectionGridProps {
  collections: CollectionItem[];
  loading?: boolean;
}

export default function CollectionGrid({
  collections,
  loading = false,
}: CollectionGridProps) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.cardSkeleton}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonText} />
          </div>
        ))}
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No collections available at the moment.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {collections.map((collection) => (
        <Link
          key={collection.id}
          href={collection.href || `/collections/${collection.id}`}
          className={styles.card}
        >
          <div className={styles.cardImage}>
            <Image
              src={getImageUrl(collection.image)}
              alt={collection.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
              priority={false}
            />
          </div>
          <h3 className={styles.cardName}>{collection.name}</h3>
        </Link>
      ))}
    </div>
  );
}
