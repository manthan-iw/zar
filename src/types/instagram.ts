export type InstagramMediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
export type InstagramMediaProductType = 'FEED' | 'REELS' | 'STORY' | 'AD';

export type InstagramPost = {
  id: string;
  image: string;
  alt: string;
  mediaType: InstagramMediaType;
  mediaProductType?: InstagramMediaProductType;
  videoUrl?: string;
  timestamp?: string;
};
