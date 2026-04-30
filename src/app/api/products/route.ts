import { NextResponse } from 'next/server';
import { getProductsByStyle } from '@/lib/data/catalog';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const purity = searchParams.get('purity')?.trim();
  const category = searchParams.get('category')?.trim();
  const style = searchParams.get('style')?.trim();

  if (!purity || !category || !style) {
    return NextResponse.json(
      { success: false, error: 'Missing required query params: purity, category, style' },
      { status: 400 }
    );
  }

  const data = getProductsByStyle(purity, category, style);
  return NextResponse.json({ success: true, data });
}
