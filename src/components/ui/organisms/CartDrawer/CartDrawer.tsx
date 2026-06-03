'use client';

import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleCart, removeItem } from '@/features/cart/cartSlice';
import styles from './CartDrawer.module.css';
import { cn, getImageUrl } from '@/lib/utils';

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);

  return (
    <>
      <div
        className={cn(styles.overlay, isOpen && styles.overlayOpen)}
        onClick={() => dispatch(toggleCart())}
        aria-hidden="true"
      />

      <aside
        className={cn(styles.drawer, isOpen && styles.drawerOpen)}
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Cart ({items.length})</h2>
          <button
            className={styles.closeBtn}
            onClick={() => dispatch(toggleCart())}
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L19 19M19 1L1 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.body}>
            <div className={styles.empty}>
              <svg className={styles.emptyIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Your cart is empty</span>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.body}>
              {items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    <Image src={getImageUrl(item.image)} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="80px" />
                  </div>
                  <div className={styles.itemDetails}>
                    <p className={styles.itemName}>{item.name}</p>
                    {item.purity && (
                      <p className={styles.itemPurity}>
                        Purity: {item.purity === '22k' ? '22K Gold' : item.purity === '18k' ? '18K Gold' : item.purity}
                      </p>
                    )}
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => dispatch(removeItem(item.id))}
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <button className={styles.checkoutBtn}>
                Proceed to Enquire
                <svg width="18" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 1L18 6M18 6L12.5 11M18 6H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
