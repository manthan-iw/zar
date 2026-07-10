import { NextRequest, NextResponse } from 'next/server';
import { isAllowedInstagramMediaUrl } from '@/lib/instagram';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const sourceUrl = request.nextUrl.searchParams.get('url');

  if (!sourceUrl) {
    return NextResponse.json({ error: 'Missing media URL.' }, { status: 400 });
  }

  if (!isAllowedInstagramMediaUrl(sourceUrl)) {
    return NextResponse.json({ error: 'Media URL is not allowed.' }, { status: 403 });
  }

  try {
    const upstream = await fetch(sourceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://www.instagram.com/',
      },
      next: { revalidate: 3600 },
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Failed to fetch Instagram media.' }, { status: upstream.status });
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to proxy Instagram media.' }, { status: 500 });
  }
}
