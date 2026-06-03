import Image from 'next/image';
import styles from './ClientLogo.module.css';
import { getImageUrl } from '@/lib/utils';

interface ClientLogoProps {
  name: string;
  logo: string;
}

export default function ClientLogo({ name, logo }: ClientLogoProps) {
  return (
    <div className={styles.clientLogo}>
      <Image src={getImageUrl(logo)} alt={name} width={200} height={125} />
    </div>
  );
}
