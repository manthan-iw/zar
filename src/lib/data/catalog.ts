import type { Category, ProductCard, ProductDetail, Style } from '@/types/domain';
import catalogData from './catalog.json';

type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  sku?: string;
  images?: string[];
  model3d?: string;
  variants?: string[];
  weight?: string;
  finish?: string;
  specifications?: Record<string, string>;
  technicalSpecs?: ProductDetail['technicalSpecs'];
  manufacturing?: ProductDetail['manufacturing'];
};

type CatalogStyle = {
  slug: string;
  name: string;
  image: string;
  products: CatalogProduct[];
};

type CatalogCategory = {
  slug: string;
  name: string;
  image: string;
  styles: CatalogStyle[];
};

type CatalogPurity = {
  purity: string;
  categories: CatalogCategory[];
};

type CatalogRoot = {
  purities: CatalogPurity[];
};

const typedCatalog = catalogData as CatalogRoot;

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function findPurity(purity: string): CatalogPurity | undefined {
  const key = normalize(purity);
  return typedCatalog.purities.find((entry) => normalize(entry.purity) === key);
}

function findCategory(purity: string, categorySlug: string): CatalogCategory | undefined {
  const key = normalize(categorySlug);
  return findPurity(purity)?.categories.find((entry) => normalize(entry.slug) === key);
}

function findStyle(purity: string, categorySlug: string, styleSlug: string): CatalogStyle | undefined {
  const key = normalize(styleSlug);
  return findCategory(purity, categorySlug)?.styles.find((entry) => normalize(entry.slug) === key);
}

function toProductCard(
  purity: string,
  categorySlug: string,
  styleSlug: string,
  product: CatalogProduct
): ProductCard {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: categorySlug,
    purity,
    style: styleSlug,
  };
}

export function getCategoriesByPurity(purity: string): Category[] {
  return (findPurity(purity)?.categories || []).map((category) => ({
    id: `${purity}-${category.slug}`,
    slug: category.slug,
    name: category.name,
    image: category.image,
    purity,
  }));
}

export function getStylesByCategory(purity: string, categorySlug: string): Style[] {
  return (findCategory(purity, categorySlug)?.styles || []).map((style) => ({
    id: `${purity}-${categorySlug}-${style.slug}`,
    slug: style.slug,
    name: style.name,
    image: style.image,
    purity,
    categorySlug,
  }));
}

export function getProductsByStyle(purity: string, categorySlug: string, styleSlug: string): ProductCard[] {
  return (findStyle(purity, categorySlug, styleSlug)?.products || []).map((product) =>
    toProductCard(purity, categorySlug, styleSlug, product)
  );
}

export function getProductDetail(
  purity: string,
  categorySlug: string,
  styleSlug: string,
  productId: string
): ProductDetail | null {
  const style = findStyle(purity, categorySlug, styleSlug);
  const product = style?.products.find((entry) => normalize(entry.id) === normalize(productId));

  if (!style || !product) {
    return null;
  }

  const card = toProductCard(purity, categorySlug, styleSlug, product);

  return {
    ...card,
    sku: product.sku || `${style.name} Collection`,
    model3d: product.model3d || '/images/models/ZAR-1.glb',
    variants: product.variants || ['2.2', '2.4', '2.6', '2.8'],
    weight: product.weight || '8.186',
    finish: product.finish || 'High-polish with intricate laser-cut filigree work.',
    specifications: product.specifications || {
      'Gross Weight:': '42.500 grams',
      'Net Gold Weight:': '38.200 grams',
      'Stone Weight:': '4.300 grams (21.50 Carats)',
    },
    technicalSpecs: product.technicalSpecs || [
      { feature: 'Metal Purity', details: `Standard ${purity.toUpperCase()} Gold` },
      { feature: 'Finish', details: 'High-Polish Tri-Tone' },
      { feature: 'Stone Composition', details: 'Premium Princess-Cut Synthetic Rubies' },
      { feature: 'Construction', details: 'Cast and CNC hybrid for uniform durability' },
    ],
    manufacturing: product.manufacturing || {
      heading: 'Manufacturing & Customization Support',
      subtitle: 'As the direct manufacturer, Zar offers the following B2B support for this design:',
      points: [
        {
          label: 'Stone Customization',
          text: 'Replace synthetic stones with natural stones or certified diamonds for bulk orders.',
        },
        {
          label: 'Size Scalability',
          text: 'Available in standard Indian sizes (2.2 to 2.10) with adjusted weight calculations.',
        },
        {
          label: 'Branding',
          text: 'Provision for private-label hallmarking or custom HUID engraving for volume orders.',
        },
      ],
    },
    images: product.images?.length ? product.images : [product.image],
  };
}

export function getRelatedProducts(
  purity: string,
  categorySlug: string,
  styleSlug: string,
  excludeProductId?: string
): ProductCard[] {
  return getProductsByStyle(purity, categorySlug, styleSlug)
    .filter((product) => normalize(product.id) !== normalize(excludeProductId || ''))
    .slice(0, 6);
}
