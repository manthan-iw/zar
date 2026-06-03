'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import CartButton from '@/components/ui/atoms/CartButton/CartButton';
import { useAppDispatch } from '@/store/hooks';
import { addItem, toggleCart } from '@/features/cart/cartSlice';
import EnquiryModal from '@/components/ui/organisms/EnquiryModal/EnquiryModal';
import styles from './RelatedProductsSlider.module.css';

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  purity?: string;
}

interface RelatedProductsSliderProps {
  title: string;
  products: Product[];
  basePath: string;
}

export default function RelatedProductsSlider({
  title,
  products,
  basePath,
}: RelatedProductsSliderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const safeProducts = useMemo(() => products ?? [], [products]);

  function openEnquiry(product: Product) {
    setSelectedProduct(product);
    setEnquiryOpen(true);
  }

  function closeEnquiry() {
    setSelectedProduct(null);
    setEnquiryOpen(false);
  }

  function goToProduct(productId: string) {
    router.push(`${basePath}/${productId}`);
  }

  function handleAddToCart(product: Product) {
    dispatch(addItem({
      id: product.id,
      name: product.title,
      price: 12999,
      quantity: 1,
      image: product.image,
      purity: product.purity,
    }));
    dispatch(toggleCart());
  }

  return (
    <section className="mt-100" aria-label="Related products">
      <div className={styles.inner}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrowBtn}
              onClick={() => swiper?.slidePrev()}
              aria-label="Previous products"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.arrowBtn}
              onClick={() => swiper?.slideNext()}
              aria-label="Next products"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          onSwiper={setSwiper}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 16 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1200: { slidesPerView: 3, spaceBetween: 50 },
          }}
          className={styles.swiper}
        >
          {safeProducts.map((product) => (
            <SwiperSlide key={product.id} className={styles.slide}>
              <div
                className={styles.productCard}
                role="link"
                tabIndex={0}
                onClick={() => goToProduct(product.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    goToProduct(product.id);
                  }
                }}
                aria-label={`View details for ${product.title}`}
              >
                <div className={styles.productImageWrapper}>
                  <Image
                    src={getImageUrl(product.image)}
                    alt={product.title}
                    fill
                    className={styles.productImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.productContent}>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.title}</h3>
                    <p className={styles.productDesc}>{product.description}</p>
                  </div>
                  <div onClick={(event) => event.stopPropagation()}>
                    <CartButton
                      onClick={() => handleAddToCart(product)}
                      className={styles.enquireBtn}
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <EnquiryModal
        open={enquiryOpen}
        onClose={closeEnquiry}
        productName={selectedProduct?.title}
      />
    </section>
  );
}
