import type { Category, ProductCard, ProductDetail, Style } from '@/types/domain';
import { apiGet } from './client';

type ProductDetailResponse = {
  product: ProductDetail;
  related: ProductCard[];
};

export async function fetchCategories(purity: string): Promise<Category[]> {
  const params = new URLSearchParams({ purity });
  return apiGet<Category[]>(`/api/categories?${params.toString()}`);
}

export async function fetchStyles(purity: string, category: string): Promise<Style[]> {
  const params = new URLSearchParams({ purity, category });
  return apiGet<Style[]>(`/api/categories?${params.toString()}`);
}

export async function fetchProducts(
  purity: string,
  category: string,
  style: string
): Promise<ProductCard[]> {
  const params = new URLSearchParams({ purity, category, style });
  return apiGet<ProductCard[]>(`/api/products?${params.toString()}`);
}

export async function fetchProductDetail(
  purity: string,
  category: string,
  style: string,
  id: string
): Promise<ProductDetailResponse> {
  const params = new URLSearchParams({ purity, category, style });
  return apiGet<ProductDetailResponse>(`/api/products/${id}?${params.toString()}`);
}
