import Link from 'next/link';
import Image from 'next/image';
import styles from './CollectionCard.module.css';
import { cn, getImageUrl } from '@/lib/utils';

interface CollectionCardProps {
  name: string;
  image: string;
  href: string;
  active?: boolean;
}

export default function CollectionCard({ name, image, href, active = false }: CollectionCardProps) {
  return (
    <Link href={href} className={cn(styles.card, active && styles.cardActive)}>
      <div className={styles.imageWrapper}>
        {/* <div className={styles.circleOuter} />
        <div className={styles.circleInner} /> */}
        <Image
          src={getImageUrl(image)}
          alt={name}
          width={active ? 303 : 214}
          height={active ? 412 : 290}
          className={styles.productImage}
        />
      </div>
      {active && <span className={styles.name}>{name}</span>}
    </Link>
  );
}
