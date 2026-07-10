'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './InstagramCard.module.css';

interface InstagramCardProps {
  image: string;
  alt: string;
  videoUrl?: string;
  isLoading?: boolean;
}

export default function InstagramCard({
  image,
  alt,
  videoUrl,
  isLoading = false,
}: InstagramCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isExternal = /^https?:\/\//i.test(image);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
      setIsPlaying(true);
      return;
    }

    video.pause();
    setIsPlaying(false);
  }, []);

  if (isLoading) {
    return <div className={`${styles.card} ${styles.skeleton}`} aria-hidden="true" />;
  }

  if (videoUrl) {
    return (
      <button
        type="button"
        className={`${styles.card} ${styles.videoCard}`}
        onClick={togglePlayback}
        aria-label={`Play ${alt}`}
      >
        <video
          ref={videoRef}
          className={styles.video}
          src={videoUrl}
          poster={image}
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        {!isPlaying && (
          <span className={styles.playOverlay} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          </span>
        )}
      </button>
    );
  }

  return (
    <div className={styles.card}>
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        unoptimized={isExternal}
      />
    </div>
  );
}
