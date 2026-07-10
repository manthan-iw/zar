'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import styles from './ProductGallery.module.css';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.thumbnailList}>
        {images.map((img, index) => (
          <button 
            key={index} 
            className={`${styles.thumbnailBtn} ${activeImage === img ? styles.active : ''}`}
            onClick={() => setActiveImage(img)}
          >
            <Image 
              src={getImageUrl(img)} 
              alt={`Thumbnail ${index + 1}`} 
              fill
              className={styles.thumbnailImg} 
            />
          </button>
        ))}
      </div>
      
      <div className={styles.mainImageContainer}>
        <Image 
          src={getImageUrl(activeImage)} 
          alt="Product Main Image" 
          fill
          priority
          className={styles.mainImage}
        />
      </div>
    </div>
  );
}
