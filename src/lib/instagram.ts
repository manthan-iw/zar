import type { InstagramMediaType, InstagramPost } from '@/types/instagram';

const INSTAGRAM_MEDIA_URL = 'https://graph.instagram.com/me/media';
const CACHE_SECONDS = 3600;

type InstagramMediaItem = {
  id: string;
  media_type: InstagramMediaType;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  caption?: string;
};

type InstagramMediaResponse = {
  data?: InstagramMediaItem[];
  error?: { message: string; code?: number; type?: string };
};

export type InstagramFetchResult = {
  posts: InstagramPost[];
  error?: string;
};

function getAccessToken(): string | undefined {
  return process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
}

function isAppAccessToken(token: string): boolean {
  if (token.includes('|')) {
    return true;
  }

  const appId = process.env.INSTAGRAM_APP_ID?.trim();
  const appSecret = process.env.INSTAGRAM_APP_SECRET?.trim();

  if (appId && appSecret && token === `${appId}|${appSecret}`) {
    return true;
  }

  return false;
}

function toProxyUrl(sourceUrl: string): string {
  return `/api/instagram/media?url=${encodeURIComponent(sourceUrl)}`;
}

function getDisplayUrl(item: InstagramMediaItem): string {
  const isVideo = item.media_type?.toUpperCase() === 'VIDEO';

  if (isVideo) {
    return item.thumbnail_url ?? item.media_url ?? '';
  }

  return item.media_url ?? item.thumbnail_url ?? '';
}

function toAltText(item: InstagramMediaItem, index: number): string {
  const caption = item.caption?.trim();
  if (caption) {
    return caption.length > 120 ? `${caption.slice(0, 117)}...` : caption;
  }

  const isVideo = item.media_type?.toUpperCase() === 'VIDEO';
  return isVideo
    ? `ZAR Jewels Instagram reel ${index + 1}`
    : `ZAR Jewels Instagram post ${index + 1}`;
}

function mapMediaItem(item: InstagramMediaItem, index: number): InstagramPost | null {
  const displayUrl = getDisplayUrl(item);
  if (!displayUrl) {
    return null;
  }

  const isVideo = item.media_type?.toUpperCase() === 'VIDEO';

  return {
    id: item.id,
    image: toProxyUrl(displayUrl),
    alt: toAltText(item, index),
    mediaType: item.media_type,
    videoUrl: isVideo && item.media_url ? toProxyUrl(item.media_url) : undefined,
  };
}

/**
 * Fetches Instagram posts — same as Laravel:
 * GET https://graph.instagram.com/me/media
 */
export async function fetchInstagramPosts(limit = 6): Promise<InstagramFetchResult> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return {
      posts: [],
      error: 'INSTAGRAM_ACCESS_TOKEN is not set in .env.local',
    };
  }

  if (isAppAccessToken(accessToken)) {
    return {
      posts: [],
      error:
        'Invalid token type: you provided an App token (app_id|secret). ' +
        'Use the long-lived User Access Token from your Laravel .env (INSTAGRAM_ACCESS_TOKEN) — it usually starts with IG... or EAAG...',
    };
  }

  const url = new URL(INSTAGRAM_MEDIA_URL);
  url.searchParams.set('fields', 'id,media_type,media_url,thumbnail_url,permalink,caption');
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
        error: 'Instagram returned no posts for this account.',
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
