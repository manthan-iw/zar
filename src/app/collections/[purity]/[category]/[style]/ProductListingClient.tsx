'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import CartButton from '@/components/ui/atoms/CartButton/CartButton';
import styles from './ProductListingClient.module.css';
import { useAppDispatch } from '@/store/hooks';
import { addItem, toggleCart } from '@/features/cart/cartSlice';

interface Product {
    id: string;
    title: string;
    description: string;
    image: string;
    price: number;
}

interface ProductListingClientProps {
    heading: string;
    description: string;
    products: Product[];
}

const SORT_OPTIONS = [
    { value: 'new-arrivals', label: 'New Arrivals' },
    { value: 'popular', label: 'Most Popular' },
];

export default function ProductListingClient({
    heading,
    description,
    products,
}: ProductListingClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const [sortBy, setSortBy] = useState('new-arrivals');
    const [filterOpen, setFilterOpen] = useState(false);

    const sortedProducts = useMemo<Product[]>(() => {
        const copy = [...products];
        if (sortBy === 'price-low-high') return copy.sort((a, b) => a.id.localeCompare(b.id));
        if (sortBy === 'price-high-low') return copy.sort((a, b) => b.id.localeCompare(a.id));
        return copy;
    }, [products, sortBy]);

    const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'New Arrivals';

    function handleAddToCart(product: Product) {
        dispatch(addItem({
            id: product.id,
            name: product.title,
            price: product.price,
            quantity: 1,
            image: product.image,
        }));
        dispatch(toggleCart());
    }

    function navigateToProduct(productId: string) {
        router.push(`${pathname}/${productId}`);
    }

    return (
        <div className='container mt-100 mb-100'>
            {/* Heading + Description */}
            <div className={styles.headerSection}>
                <h1 className={styles.heading}>
                    {heading}
                    <span className={styles.resultCount}>({products.length} Results)</span>
                </h1>
                <p className="">{description}</p>
            </div>

            {/* Filter & Sort Bar */}
            {/* <div className={styles.toolbar}>
                    <button
                        className={styles.filterBtn}
                        onClick={() => setFilterOpen((prev) => !prev)}
                        aria-expanded={filterOpen}
                    >
                        <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.75 3.75H11.3565C11.6918 5.04 12.8565 6 14.25 6C15.6435 6 16.8082 5.04 17.1435 3.75H20.25C20.664 3.75 21 3.414 21 3C21 2.586 20.664 2.25 20.25 2.25H17.1435C16.8082 0.96 15.6435 0 14.25 0C12.8565 0 11.6918 0.96 11.3565 2.25H0.75C0.336 2.25 0 2.586 0 3C0 3.414 0.336 3.75 0.75 3.75ZM14.25 1.5C15.0773 1.5 15.75 2.17275 15.75 3C15.75 3.82725 15.0773 4.5 14.25 4.5C13.4228 4.5 12.75 3.82725 12.75 3C12.75 2.17275 13.4228 1.5 14.25 1.5Z" fill="#CFB480" />
                            <path d="M20.25 12.75H9.6435C9.30825 14.04 8.1435 15 6.75 15C5.3565 15 4.19175 14.04 3.8565 12.75H0.75C0.336 12.75 0 12.414 0 12C0 11.586 0.336 11.25 0.75 11.25H3.8565C4.19175 9.96 5.3565 9 6.75 9C8.1435 9 9.30825 9.96 9.6435 11.25H20.25C20.664 11.25 21 11.586 21 12C21 12.414 20.664 12.75 20.25 12.75ZM6.75 10.5C5.92275 10.5 5.25 11.1727 5.25 12C5.25 12.8273 5.92275 13.5 6.75 13.5C7.57725 13.5 8.25 12.8273 8.25 12C8.25 11.1727 7.57725 10.5 6.75 10.5Z" fill="#CFB480" />
                        </svg>

                        Filters
                    </button>

                    <div className={styles.sortWrapper}>
                        <span className={styles.sortLabel}>
                            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.865052 0C0.38804 0 0 0.375782 0 0.837616C0 1.29945 0.38809 1.67523 0.865052 1.67523H19.1349C19.612 1.67523 20 1.29945 20 0.837616C20 0.375782 19.6119 0 19.1349 0H0.865052ZM0.865052 6.16243C0.38804 6.16243 0 6.53822 0 7.00005C0 7.46188 0.38809 7.83762 0.865052 7.83762H11.7918C12.2688 7.83762 12.6569 7.46188 12.6569 7.00005C12.6569 6.53822 12.2688 6.16243 11.7918 6.16243H0.865052ZM0.865052 12.3248C0.38804 12.3248 0 12.7006 0 13.1624C0 13.6242 0.38809 14 0.865052 14H8.81811C9.29512 14 9.68316 13.6242 9.68316 13.1624C9.68316 12.7006 9.29507 12.3248 8.81811 12.3248H0.865052Z" fill="#CFB480" />
                            </svg>
                            Sort By:
                        </span>
                        <select
                            className={styles.sortSelect}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            aria-label="Sort products"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div> */}

            {/* Filter Panel */}
            {/* {filterOpen && (
                    <div className={styles.filterPanel}>
                        <div className={styles.filterGroup}>
                            <h4 className={styles.filterGroupTitle}>Weight</h4>
                            {['Below 10g', '10g – 20g', '20g – 30g', 'Above 30g'].map((opt) => (
                                <label key={opt} className={styles.filterOption}>
                                    <input type="checkbox" />
                                    {opt}
                                </label>
                            ))}
                        </div>
                        <div className={styles.filterGroup}>
                            <h4 className={styles.filterGroupTitle}>Occasion</h4>
                            {['Daily Wear', 'Bridal', 'Festive', 'Office Wear'].map((opt) => (
                                <label key={opt} className={styles.filterOption}>
                                    <input type="checkbox" />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                )} */}

            {/* Product Grid */}
            <div className={styles.productGrid}>
                {sortedProducts.map((product: Product) => (
                    <div
                        key={product.id}
                        className={styles.productCard}
                        role="link"
                        tabIndex={0}
                        onClick={() => navigateToProduct(product.id)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                navigateToProduct(product.id);
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
                                sizes="(max-width: 768px) 50vw, 25vw"
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
                ))}
            </div>
        </div>
    );
}
