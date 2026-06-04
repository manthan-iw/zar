'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/app/about/page.module.css';

interface StoryItem {
  id: number;
  year: number;
  description: string;
  image: string;
  image_url: string;
}
    
const BACKEND_PREFIX = 'https://testintelliworkz.tech/Zar_backend';

export default function OurStory() {
  const [storyItems, setStoryItems] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const response = await fetch(`${BACKEND_PREFIX}/api/zar-journey`);
        const data = await response.json();

        if (data.success && data.items) {
          setStoryItems(data.items);
        }
      } catch (error) {
        console.error('Failed to fetch story data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoryData();
  }, []);

  return (
    <section className={styles.ourStory}>
      <div className="container">
        <h2 className="fs_54 txt_center">OUR STORY</h2>
        <div className={styles.storyGrid}>
          {loading && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p>Loading story...</p>
            </div>
          )}

          {!loading && storyItems.length > 0 &&
            storyItems.map((item) => {
              const imageSrc = item.image_url.startsWith('http')
                ? item.image_url
                : `${BACKEND_PREFIX}${item.image_url}`;

              return (
                <div key={item.id} className={styles.storyBox}>
                  <div className={styles.storyChild1}>
                    <h3 className={styles.storyYear}>{item.year}</h3>
                    <div className={styles.storyDescription}>
                      <div dangerouslySetInnerHTML={{ __html: item.description }} />
                    </div>
                  </div>
                  <div className={styles.storyChild2}>
                    <div className="storyImageWrapper">
                      <Image
                        src={imageSrc}
                        alt={`Story from ${item.year}`}
                        fill
                        className={styles.ourImage}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

          {!loading && storyItems.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <p>No stories available</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
