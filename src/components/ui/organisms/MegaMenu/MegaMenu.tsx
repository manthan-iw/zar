'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchCategories } from '@/lib/api/catalog';
import type { Category } from '@/types/domain';
import styles from './MegaMenu.module.css';
import { cn, getImageUrl } from '@/lib/utils';

const ktFilters = [
  { label: '18 KT Jewellery', value: '18kt', purity: '18k' },
  { label: '22 KT Jewellery', value: '22kt', purity: '22k' },
];

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MegaMenu({ open, onClose }: Readonly<MegaMenuProps>) {
  const [activeKt, setActiveKt] = useState('18kt');
  const [categoriesByKt, setCategoriesByKt] = useState<Record<string, Category[]>>({});
  const [loadingKt, setLoadingKt] = useState<string | null>(null);

  useEffect(() => {
    const filter = ktFilters.find((item) => item.value === activeKt);

    if (!filter) {
      return;
    }

    if (categoriesByKt[activeKt]) {
      return;
    }

    const { purity } = filter;

    let cancelled = false;

    async function loadCategories() {
      setLoadingKt(activeKt);

      try {
        const items = await fetchCategories(purity);

        if (!cancelled) {
          setCategoriesByKt((current) => ({
            ...current,
            [activeKt]: items,
          }));
        }
      } catch {
        if (!cancelled) {
          setCategoriesByKt((current) => ({
            ...current,
            [activeKt]: [],
          }));
        }
      } finally {
        if (!cancelled) {
          setLoadingKt((current) => (current === activeKt ? null : current));
        }
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, [activeKt, categoriesByKt]);

  const activePurity = ktFilters.find((item) => item.value === activeKt)?.purity || '18k';
  const categories = categoriesByKt[activeKt] ?? [];

  const overlayClass = cn(styles.overlay, open && styles.overlayOpen);

  return (
    <div className={overlayClass}>
      <div className={styles.inner}>
        <div className={styles.sidebar}>
          {ktFilters.map((kt) => (
            <button
              key={kt.value}
              type="button"
              className={cn(styles.ktCard, activeKt === kt.value && styles.ktCardActive)}
              onClick={() => setActiveKt(kt.value)}
              style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              aria-pressed={activeKt === kt.value}
            >
              <div className={styles.ktCardImageWrap}>
                <Image
                  src={kt.value === '18kt' ? '/images/menu/18k_menu.png' : '/images/menu/22kt_menu.png'}
                  alt={kt.label}
                  width={70}
                  height={70}
                />
              </div>
              <div className={styles.ktCardText}>
                <div className={styles.ktCardTitle}>
                  {kt.value === '18kt' ? '18' : '22'} <span className={styles.ktCardKt}>KT</span>
                </div>
                <div className={styles.ktCardSubtitle}>
                  {kt.value === '18kt' ? 'Contemporary Gold' : 'Classic Gold'}
                </div>
              </div>
              <div className={styles.ktCardPara}>
                {kt.value === '18kt'
                  ? 'Modern silhouettes, precise Italian design, and two-tone finishes for the minimalist.'
                  : 'Traditional craftsmanship meets everyday luxury in our signature high-purity collections.'}
                <div>
                  <a
                    href={`/collections/${kt.purity}`}
                    className={styles.ktCardLink}
                    style={{ display: 'inline-block', marginTop: 8, color: '#bfa15a', textDecoration: 'underline' }}
                    onClick={onClose}
                    tabIndex={0}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="24" rx="12" fill="#D0B480" />
                      <path d="M9 17.8491L14.4246 12.4246L9 7" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>


                  </a>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {loadingKt === activeKt && categories.length === 0 ? <p>Loading categories...</p> : null}
          {!loadingKt && categories.length === 0 ? <p>No categories available.</p> : null}
          {categories.map((category) => (
            <Link
              key={`${activePurity}-${category.id}`}
              href={`/collections/${activePurity}/${category.slug}`}
              className={styles.categoryCard}
              onClick={onClose}
            >
              <div className={styles.categoryImage}>
                <Image src={getImageUrl(category.image)} alt={category.name} fill sizes="230px" />
              </div>
              <span className={styles.categoryName}>{category.name}</span>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
