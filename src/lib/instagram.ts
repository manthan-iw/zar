import type { InstagramMediaType, InstagramPost } from '@/types/instagram';

const GRAPH_API_VERSION = 'v19.0';
const CACHE_SECONDS = 3600;

const MEDIA_FIELDS = [
  'id',
  'caption',
  'media_type',
  'media_product_type',
  'media_url',
  'thumbnail_url',
  'permalink',
  'timestamp',
].join(',');

type InstagramMediaItem = {
  id: string;
  caption?: string;
  media_type: InstagramMediaType;
  media_product_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
};

type InstagramMediaResponse = {
  data?: InstagramMediaItem[];
  paging?: { next?: string };
  error?: { message: string; code?: number; type?: string };
};

export type InstagramFetchResult = {
  posts: InstagramPost[];
  error?: string;
};

function getUserId(): string | undefined {
  return (process.env.IG_USER_ID ?? process.env.INSTAGRAM_USER_ID)?.trim();
}

function getAccessToken(): string | undefined {
  return (process.env.IG_ACCESS_TOKEN ?? process.env.INSTAGRAM_ACCESS_TOKEN)?.trim();
}

function toProxyUrl(sourceUrl: string): string {
  return `/api/instagram/media?url=${encodeURIComponent(sourceUrl)}`;
}

function isVideoMedia(item: InstagramMediaItem): boolean {
  const mediaType = item.media_type?.toUpperCase();
  const productType = item.media_product_type?.toUpperCase();

  return mediaType === 'VIDEO' || productType === 'REELS';
}

/**
 * VIDEO / REELS → thumbnail_url for poster
 * IMAGE / CAROUSEL → media_url
 */
function getDisplayUrl(item: InstagramMediaItem): string {
  if (isVideoMedia(item)) {
    return item.thumbnail_url ?? item.media_url ?? '';
  }

  return item.media_url ?? item.thumbnail_url ?? '';
}

function toAltText(item: InstagramMediaItem, index: number): string {
  const caption = item.caption?.trim();
  if (caption) {
    return caption.length > 120 ? `${caption.slice(0, 117)}...` : caption;
  }

  if (isVideoMedia(item)) {
    return item.media_product_type?.toUpperCase() === 'REELS'
      ? `ZAR Jewels Instagram reel ${index + 1}`
      : `ZAR Jewels Instagram video ${index + 1}`;
  }

  return `ZAR Jewels Instagram post ${index + 1}`;
}

function mapMediaItem(item: InstagramMediaItem, index: number): InstagramPost | null {
  const displayUrl = getDisplayUrl(item);
  if (!displayUrl) {
    return null;
  }

  const isVideo = isVideoMedia(item);

  return {
    id: item.id,
    image: toProxyUrl(displayUrl),
    alt: toAltText(item, index),
    mediaType: item.media_type,
    mediaProductType: item.media_product_type as InstagramPost['mediaProductType'],
    videoUrl: isVideo && item.media_url ? toProxyUrl(item.media_url) : undefined,
    timestamp: item.timestamp,
  };
}

/**
 * Fetches Instagram posts & reels via Facebook Graph API:
 * GET https://graph.facebook.com/v19.0/{IG_USER_ID}/media
 */
export async function fetchInstagramPosts(limit = 12): Promise<InstagramFetchResult> {
  const userId = getUserId();
  const accessToken = getAccessToken();

  if (!userId || !accessToken) {
    return {
      posts: [],
      error: 'IG_USER_ID and IG_ACCESS_TOKEN must be set in .env.local',
    };
  }

  const url = new URL(`https://graph.facebook.com/${GRAPH_API_VERSION}/${userId}/media`);
  url.searchParams.set('fields', MEDIA_FIELDS);
  url.searchParams.set('access_token', accessToken);
  url.searchParams.set('limit', String(limit));

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: CACHE_SECONDS },
    });

    const payload = (await response.json()) as InstagramMediaResponse;

    if (!response.ok || payload.error) {
      return {
        posts: [],
        error: payload.error?.message ?? `Instagram API returned status ${response.status}`,
      };
    }

    const posts = (payload.data ?? [])
      .map((item, index) => mapMediaItem(item, index))
      .filter((post): post is InstagramPost => post !== null);

    if (posts.length === 0) {
      return {
        posts: [],
        error: 'Instagram returned no posts or reels for this account.',
      };
    }

    return { posts };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      posts: [],
      error: `Instagram request failed: ${message}`,
    };
  }
}

export function isAllowedInstagramMediaUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    return (
      host.endsWith('cdninstagram.com') ||
      host.endsWith('fbcdn.net') ||
      host === 'instagram.com' ||
      host.endsWith('.instagram.com')
    );
  } catch {
    return false;
  }
}
