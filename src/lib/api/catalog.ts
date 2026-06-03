import type { Category, ProductCard, ProductDetail, Style, TechnicalSpec } from '@/types/domain';

type ProductDetailResponse = {
  product: ProductDetail;
  related: ProductCard[];
};

export class CatalogApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'CatalogApiError';
    this.status = status;
  }
}

type BackendListResponse<T> = {
  success: boolean;
  items?: T[];
  error?: string;
};

type BackendDetailResponse<T> = {
  success?: boolean;
  product?: T;
  error?: string;
};

type BackendCategoryItem = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  image_url: string | null;
  gold_type_id: number;
  gold_type_name: string;
  created_at: string;
  updated_at: string;
};

type BackendCollectionTypeItem = {
  id: number;
  name: string;
  image: string | null;
  image_url: string | null;
  gold_type_id: number;
  gold_type_name: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  created_at: string;
  updated_at: string;
};

type BackendProductItem = {
  id: number;
  category_id: number;
  category_name: string;
  gold_type_id: number;
  gold_type_name: string;
  collection_type_id: number;
  collection_type_name: string;
  sku: string | null;
  title: string;
  short_description: string | null;
  number_of_pcs: number | null;
  display_finish: string | null;
  weight_specifications: Array<Record<string, string>> | null;
  technical_specifications: Array<Record<string, string>> | null;
  manufacturing_support: string | null;
  product_url: string | null;
  product_images: string[] | null;
  created_at: string;
  updated_at: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://testintelliworkz.tech/Zar_backend';

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replaceAll('&', 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function deslugify(value: string): string {
  return value.replaceAll('-', ' ').trim();
}

function toPuritySlug(value: string): string {
  const match = /(\d{2})/.exec(value);
  return match ? `${match[1]}k` : slugify(value);
}

function toGoldTypeQuery(purity: string): string {
  const normalized = normalize(purity);
  if (normalized.includes('18')) {
    return '18KT';
  }
  if (normalized.includes('22')) {
    return '22KT';
  }
  return purity;
}

function toImagePath(value?: string | null): string {
  if (!value) {
    return '/images/about/about_banner.webp';
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return value.startsWith('/') ? value : `/${value}`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function toWeightSpecifications(items: BackendProductItem['weight_specifications']): Record<string, string> {
  if (!items?.length) {
    return {};
  }

  return items.reduce<Record<string, string>>((accumulator, item, index) => {
    const size = item.size || item.label || item.name || `Item ${index + 1}`;
    const value = item.weight || item.value || Object.values(item)[1] || Object.values(item)[0] || '';
    accumulator[size] = value;
    return accumulator;
  }, {});
}

function toTechnicalSpecifications(items: BackendProductItem['technical_specifications']): TechnicalSpec[] {
  if (!items?.length) {
    return [];
  }

  return items.flatMap((item) =>
    Object.entries(item)
      .filter(([, value]) => value != null && `${value}`.trim() !== '')
      .map(([feature, details]) => ({
        feature,
        details: `${details}`,
      }))
  );
}

async function fetchCatalogEndpoint<T>(path: string, searchParams?: URLSearchParams): Promise<T> {
  const query = searchParams?.toString();
  const requestUrl = `${API_BASE_URL}${path}${query ? '?' + query : ''}`;
  const response = await fetch(requestUrl, {
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: 60 },
  });

  const payload = (await response.json()) as T & { error?: string; success?: boolean };

  if (!response.ok) {
    throw new CatalogApiError(response.status, payload.error || 'Catalog API request failed');
  }

  return payload;
}

export function isCatalogRouteError(error: unknown): boolean {
  return error instanceof CatalogApiError && (error.status === 400 || error.status === 404);
}

function toCategory(item: BackendCategoryItem): Category {
  return {
    id: String(item.id),
    name: item.name,
    slug: item.slug,
    image: toImagePath(item.image_url || item.image),
    purity: toPuritySlug(item.gold_type_name),
    imageUrl: item.image_url || undefined,
    goldTypeId: item.gold_type_id,
    goldTypeName: item.gold_type_name,
  };
}

function toStyle(item: BackendCollectionTypeItem): Style {
  return {
    id: String(item.id),
    name: item.name,
    slug: slugify(item.name),
    image: toImagePath(item.image_url || item.image),
    purity: toPuritySlug(item.gold_type_name),
    categorySlug: item.category_slug,
    imageUrl: item.image_url || undefined,
    goldTypeId: item.gold_type_id,
    goldTypeName: item.gold_type_name,
    categoryId: item.category_id,
    categoryName: item.category_name,
  };
}

function toProductCard(item: BackendProductItem): ProductCard {
  const images = item.product_images?.map((image) => toImagePath(image)) || [];
  return {
    id: String(item.id),
    slug: String(item.id),
    name: item.title,
    description: item.short_description || '',
    price: 0,
    image: images[0] || '/images/about/about_banner.webp',
    images,
    category: item.category_name,
    purity: toPuritySlug(item.gold_type_name),
    style: slugify(item.collection_type_name),
    sku: item.sku || undefined,
    categoryId: item.category_id,
    categoryName: item.category_name,
    goldTypeId: item.gold_type_id,
    goldTypeName: item.gold_type_name,
    collectionTypeId: item.collection_type_id,
    collectionTypeName: item.collection_type_name,
    numberOfPcs: item.number_of_pcs || undefined,
    finish: item.display_finish || undefined,
    productUrl: item.product_url || undefined,
  };
}

function toProductDetail(item: BackendProductItem): ProductDetail {
  const card = toProductCard(item);

  return {
    ...card,
    sku: item.sku || `ZAR-${item.id}`,
    images: card.images?.length ? card.images : [card.image],
    pcs: item.number_of_pcs ? String(item.number_of_pcs) : undefined,
    finish: item.display_finish || undefined,
    specifications: toWeightSpecifications(item.weight_specifications),
    technicalSpecs: toTechnicalSpecifications(item.technical_specifications),
    manufacturingHtml: item.manufacturing_support
      ? `<p>${escapeHtml(item.manufacturing_support)}</p>`
      : undefined,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export async function fetchCategories(purity: string): Promise<Category[]> {
  const searchParams = new URLSearchParams({ gold_type: toGoldTypeQuery(purity) });
  const payload = await fetchCatalogEndpoint<BackendListResponse<BackendCategoryItem>>('/api/categories', searchParams);
  return (payload.items || []).map(toCategory);
}

export async function fetchStyles(purity: string, category: string): Promise<Style[]> {
  const searchParams = new URLSearchParams({
    gold_type: toGoldTypeQuery(purity),
    category_name: category,
  });
  const payload = await fetchCatalogEndpoint<BackendListResponse<BackendCollectionTypeItem>>('/api/collection-types', searchParams);
  return (payload.items || []).map(toStyle);
}

export async function fetchProducts(
  purity: string,
  category: string,
  style: string
): Promise<ProductCard[]> {
  const searchParams = new URLSearchParams({
    gold_type: toGoldTypeQuery(purity),
    category,
    collection_type: deslugify(style),
  });
  const payload = await fetchCatalogEndpoint<BackendListResponse<BackendProductItem>>('/api/products', searchParams);
  return (payload.items || []).map(toProductCard);
}

export async function fetchProductDetail(
  purity: string,
  category: string,
  style: string,
  id: string
): Promise<ProductDetailResponse> {
  const payload = await fetchCatalogEndpoint<BackendDetailResponse<BackendProductItem>>(`/api/products/${id}`);
  const productItem = payload.product;

  if (!productItem) {
    throw new CatalogApiError(404, 'Product not found');
  }

  const product = toProductDetail(productItem);
  const routePurity = toPuritySlug(purity);
  const routeCategory = normalize(category);
  const routeStyle = normalize(style);
  const productCategory = normalize(productItem.category_name);
  const productCategorySlug = normalize(slugify(productItem.category_name));
  const productStyle = normalize(slugify(productItem.collection_type_name));

  if (
    routePurity !== product.purity ||
    (routeCategory !== productCategory && routeCategory !== productCategorySlug) ||
    routeStyle !== productStyle
  ) {
    throw new CatalogApiError(404, 'Product not found');
  }

  const relatedSearchParams = new URLSearchParams({
    goldtype_id: String(productItem.gold_type_id),
    category_id: String(productItem.category_id),
    collectiontype_id: String(productItem.collection_type_id),
  });
  const relatedPayload = await fetchCatalogEndpoint<BackendListResponse<BackendProductItem>>('/api/products', relatedSearchParams);
  const related = (relatedPayload.items || [])
    .filter((item) => String(item.id) !== String(productItem.id))
    .slice(0, 6)
    .map(toProductCard);

  return {
    product,
    related,
  };
}
