import type { Category, ProductCard, ProductDetail, Style } from '@/types/domain';

const CATEGORIES = [
  { slug: 'bangles-bracelet', name: 'Bangles & Bracelet', image: '/images/menu/menu-1.png' },
  { slug: 'mangalsutra-necklace', name: 'Mangalsutra & Necklace', image: '/images/menu/menu-2.png' },
  { slug: 'mens-jewellery', name: 'Mens Jewellery', image: '/images/menu/menu-3.png' },
  { slug: 'earrings', name: 'Earrings', image: '/images/menu/menu-4.png' },
  { slug: 'kids-jewellery', name: 'Kids Jewellery', image: '/images/menu/menu-5.png' },
  { slug: 'lightweight-jewellery', name: 'Lightweight Jewellery', image: '/images/menu/menu-8.png' },
  { slug: 'rings', name: 'Rings', image: '/images/menu/menu-6.png' },
] as const;

const STYLES = [
  { slug: 'plain', name: 'Plain' },
  { slug: 'handmade', name: 'Handmade' },
  { slug: 'fancy', name: 'Fancy' },
  { slug: 'multicolor', name: 'Multicolor' },
  { slug: 'virbance-enamel', name: 'Virbance (Enamel)' },
  { slug: 'dazzling-stone', name: 'Dazzling (Stone)' },
  { slug: 'broad', name: 'Broad' },
  { slug: 'openable', name: 'Openable' },
] as const;

const PRODUCT_IMAGES = [
  '/images/homepage/product_1.webp',
  '/images/homepage/product_2.webp',
  '/images/homepage/product_3.webp',
];

function titleCase(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function styleProducts(purity: string, category: string, style: string): ProductCard[] {
  return Array.from({ length: 8 }).map((_, index) => {
    const sequence = index + 1;
    const id = `${style}-${sequence}`;
    return {
      id,
      slug: id,
      name: `Design No. CS1000${(sequence + 5).toString().padStart(2, '0')}`,
      description: `${titleCase(style)} collection crafted for premium retail assortment and daily wear elegance.`,
      price: 18000 + sequence * 1250,
      image: PRODUCT_IMAGES[index % PRODUCT_IMAGES.length],
      category,
      purity,
      style,
    };
  });
}

export function getCategoriesByPurity(purity: string): Category[] {
  return CATEGORIES.map((category) => ({
    id: `${purity}-${category.slug}`,
    slug: category.slug,
    name: category.name,
    image: category.image,
    purity,
  }));
}

export function getStylesByCategory(purity: string, categorySlug: string): Style[] {
  return STYLES.map((style) => ({
    id: `${purity}-${categorySlug}-${style.slug}`,
    slug: style.slug,
    name: style.name,
    image: '/images/collections/Broad.webp',
    purity,
    categorySlug,
  }));
}

export function getProductsByStyle(purity: string, categorySlug: string, styleSlug: string): ProductCard[] {
  return styleProducts(purity, categorySlug, styleSlug);
}

export function getProductDetail(
  purity: string,
  categorySlug: string,
  styleSlug: string,
  productId: string
): ProductDetail | null {
  const products = styleProducts(purity, categorySlug, styleSlug);
  const card = products.find((product) => product.id === productId);

  if (!card) {
    return null;
  }

  return {
    ...card,
    sku: `${titleCase(styleSlug)} Collection`,
    model3d: '/images/models/ZAR-1.glb',
    variants: ['2.2', '2.4', '2.6', '2.8'],
    weight: '8.186',
    finish: 'High-polish with intricate laser-cut filigree work.',
    specifications: {
      'Gross Weight:': '42.500 grams',
      'Net Gold Weight:': '38.200 grams',
      'Stone Weight:': '4.300 grams (21.50 Carats)',
    },
    technicalSpecs: [
      { feature: 'Metal Purity', details: `Standard ${purity.toUpperCase()} Gold` },
      { feature: 'Finish', details: 'High-Polish Tri-Tone' },
      { feature: 'Stone Composition', details: 'Premium Princess-Cut Synthetic Rubies' },
      { feature: 'Construction', details: 'Cast and CNC hybrid for uniform durability' },
    ],
    manufacturing: {
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
    images: ['/images/dazz-coll.webp', ...PRODUCT_IMAGES],
  };
}

export function getRelatedProducts(
  purity: string,
  categorySlug: string,
  styleSlug: string,
  excludeProductId?: string
): ProductCard[] {
  return styleProducts(purity, categorySlug, styleSlug)
    .filter((product) => product.id !== excludeProductId)
    .slice(0, 6);
}
