export type InstagramMediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

export type InstagramPost = {
  id: string;
  image: string;
  alt: string;
  mediaType: InstagramMediaType;
  videoUrl?: string;
  timestamp?: string;
};
