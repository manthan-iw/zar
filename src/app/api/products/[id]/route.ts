import { NextResponse } from 'next/server';
import { getProductDetail, getRelatedProducts } from '@/lib/data/catalog';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;
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

  const product = getProductDetail(purity, category, style, id);

  if (!product) {
    return NextResponse.json(
      { success: false, error: 'Product not found' },
      { status: 404 }
    );
  }

  const related = getRelatedProducts(purity, category, style, id);

  return NextResponse.json({
    success: true,
    data: {
      product,
      related,
    },
  });
}
