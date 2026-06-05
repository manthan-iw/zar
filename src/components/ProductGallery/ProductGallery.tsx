'use client';

import React, { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils';
import styles from './ProductGallery.module.css';

interface ProductGalleryProps {
  images: string[];
  // productName?: string;
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  
  const imgContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imgContainerRef.current) return;

    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

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
      
      <div 
        className={styles.mainImageContainer}
        ref={imgContainerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image 
          src={getImageUrl(activeImage)} 
          alt="Product Main Image" 
          fill
          priority
          className={`${styles.mainImage} ${isZoomed ? styles.zoomed : ''}`}
          style={{
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
          }}
        />
      </div>
    </div>
  );
}
