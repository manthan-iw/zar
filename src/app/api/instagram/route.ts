import { NextResponse } from 'next/server';
import { fetchInstagramPosts } from '@/lib/instagram';

export const revalidate = 3600;

export async function GET() {
  const { posts, error } = await fetchInstagramPosts(12);

  return NextResponse.json({
    success: posts.length > 0,
    posts,
    error,
  });
}
