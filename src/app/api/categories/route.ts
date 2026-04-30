import { NextResponse } from 'next/server';
import { getCategoriesByPurity, getStylesByCategory } from '@/lib/data/catalog';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const purity = searchParams.get('purity')?.trim();
  const category = searchParams.get('category')?.trim();

  if (!purity) {
    return NextResponse.json(
      { success: false, error: 'Missing required query param: purity' },
      { status: 400 }
    );
  }

  const data = category
    ? getStylesByCategory(purity, category)
    : getCategoriesByPurity(purity);

  return NextResponse.json({ success: true, data });
}
