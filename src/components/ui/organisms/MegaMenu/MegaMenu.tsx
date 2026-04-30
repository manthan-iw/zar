'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/atoms/Button/Button';
import styles from './MegaMenu.module.css';
import { cn } from '@/lib/utils';

const ktFilters = [
  { label: '22 KT Jewellery', value: '22kt' },
  { label: '18 KT Jewellery', value: '18kt' },
];

interface Category {
  label: string;
  href: string;
  image: string;
}

const categoriesByKt: Record<string, Category[]> = {
  '22kt': [
    { label: 'Bangles & Bracelet', href: '/collections/22k/bangles-bracelet', image: '/images/menu/menu-1.png' },
    { label: 'Mangalsutra & Necklace', href: '/collections/22k/mangalsutra-necklace', image: '/images/menu/menu-2.png' },
    { label: 'Mens Jewellery', href: '/collections/22k/mens-jewellery', image: '/images/menu/menu-3.png' },
    { label: 'Earrings', href: '/collections/22k/earrings', image: '/images/menu/menu-4.png' },
    { label: 'Kids Jewellery', href: '/collections/22k/kids-jewellery', image: '/images/menu/menu-5.png' },
    { label: 'Lightweight Jewellery', href: '/collections/22k/lightweight-jewellery', image: '/images/menu/menu-8.png' },
    { label: 'Rings', href: '/collections/22k/rings', image: '/images/menu/menu-6.png' },
  ],
  '18kt': [
    { label: 'Bangles & Bracelet', href: '/collections/18k/bangles-bracelet', image: '/images/menu/menu-1.png' },
    { label: 'Mangalsutra & Necklace', href: '/collections/18k/mangalsutra-necklace', image: '/images/menu/menu-2.png' },
    { label: 'Lightweight Jewellery', href: '/collections/18k/lightweight-jewellery', image: '/images/menu/menu-3.png' },
    { label: 'Earrings', href: '/collections/18k/earrings', image: '/images/menu/menu-4.png' },
    { label: 'Rings', href: '/collections/18k/rings', image: '/images/menu/menu-5.png' },
    { label: 'Kids Jewellery', href: '/collections/18k/kids-jewellery', image: '/images/menu/menu-6.png' },
  ],
};

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MegaMenu({ open, onClose }: MegaMenuProps) {
  const [activeKt, setActiveKt] = useState('22kt');

  const categories = categoriesByKt[activeKt] ?? categoriesByKt['22kt'];

  const overlayClass = cn(styles.overlay, open && styles.overlayOpen);
  // console.log('MegaMenu open:', open, 'class:', overlayClass);

  return (
    <div className={overlayClass}>
      <div className={styles.inner}>
        <div className={styles.sidebar}>
          {ktFilters.map((filter) => (
            <button
              key={filter.value}
              className={cn(styles.ktButton, activeKt === filter.value && styles.ktButtonActive)}
              onClick={() => setActiveKt(filter.value)}
            >
              {filter.label}
              <span className={styles.ktArrow}>
                <svg viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={styles.categoryCard}
              onClick={onClose}
            >
              <div className={styles.categoryImage}>
                <Image src={cat.image} alt={cat.label} fill sizes="230px" />
              </div>
              <span className={styles.categoryName}>{cat.label}</span>
            </Link>
          ))}
        </div>

        <div className={styles.featured}>
          <div className={styles.featuredImage}>
            <Image
              src="/images/dazz-coll.webp"
              alt="Dazzling Collection"
              fill
              sizes="300px"
              loading="eager"
            />
          </div>
          <h3 className={styles.featuredTitle}>Dazzling Collection (Stone)</h3>
          {/* <Link href="/collections/dazzling" className={styles.featuredButton}>
            Explore Collection
            <span className={styles.featuredArrow}>
              <svg viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5H12M8.5 1L12.5 5L8.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link> */}
          <Button href={`/collections/${activeKt === '18kt' ? '18k' : '22k'}`}  variant="primary" showArrow>
            Explore Collections
          </Button>
        </div>
      </div>
    </div>
  );
}
