import Link from 'next/link';
import Image from 'next/image';
import styles from './Logo.module.css';

export default function Logo() {
  return (
    <div className={styles.logo}>
      <Link href="/" className={styles.logoLink}>
        <Image
          src="/images/zar-logo.svg"
          alt="Zar Jewels"
          width={100}
          height={40}
          priority
          className={styles.logoImage}
        />
      </Link>
    </div>
  );
}
