import Image from 'next/image';
import { imagePath } from '@/lib/imagePath';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <Image src={imagePath(icon)} alt={title} width={120} height={120} />
      </div>
      <div className={styles.content}>
        <h3 className="fs_30">{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
