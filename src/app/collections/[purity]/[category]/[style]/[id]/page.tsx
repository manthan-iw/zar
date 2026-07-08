import Image from 'next/image';
import PageHeader from '@/components/ui/PageHeader/PageHeader';
import ProductGallery from '@/components/ProductGallery/ProductGallery';
import ProductInfo from '@/components/ProductInfo/ProductInfo';
import RelatedProductsSlider from '@/components/RelatedProductsSlider/RelatedProductsSlider';
import { fetchGoldTypes, fetchStyles, fetchProducts, isCatalogRouteError } from '@/lib/api/catalog';
import { fetchProductDetail, fetchCategories } from '@/lib/api/catalog.server';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { imagePath } from '@/lib/imagePath';

import TradeHighlightsSlider from '@/components/TradeHighlightsSlider';


export async function generateStaticParams(): Promise<
  Array<{ purity: string; category: string; style: string; id: string }>
> {
  try {
    const goldTypes = await fetchGoldTypes();
    const params: Array<{ purity: string; category: string; style: string; id: string }> = [];

    for (const goldType of goldTypes) {
      const purity = goldType.purity;
      const categories = await safeFetch(() => fetchCategories(purity), purity);

      for (const cat of categories) {
        const category = cat.slug;
        const styles = await safeFetch(
          () => fetchStyles(purity, cat.name),
          `${purity}/${cat.name}`
        );

        for (const style of styles) {
          const styleSlug = style.slug;
          const products = await safeFetch(
            () => fetchProducts(purity, cat.name, style.name),
            `${purity}/${cat.name}/${style.name}`
          );

          for (const product of products) {
            if (product.slug) {
              params.push({
                purity,
                category,
                style: styleSlug,
                id: product.slug,
              });
            }
          }
        }
      }
    }

    console.log(`✅ Generated ${params.length} static product paths`);

    return params.length > 0 ? params : getFallbackParams();
  } catch (error) {
    console.error('❌ Failed to generate static params:', error);
    return getFallbackParams();
  }
}

// Helper to reduce nested try/catch complexity
async function safeFetch<T>(
  fetchFn: () => Promise<T[]>,
  context: string
): Promise<T[]> {
  try {
    return await fetchFn();
  } catch (error) {
    console.warn(`Failed to fetch data for ${context}`, error);
    return []; // Continue with empty array instead of breaking
  }
}

function getFallbackParams() {
  return [
    {
      purity: '18k',
      category: 'necklaces',
      style: 'modern',
      id: 'sample-product',
    },
  ];
}

type Props = {
  params: Promise<{ purity: string; category: string; style: string; id: string }>;
};


type TradeHighlight = {
  icon: string;
  title: string;
  description: string;
};

const TRADE_HIGHLIGHTS: TradeHighlight[] = [
  {
    icon: imagePath('/images/sa.svg'),
    title: 'Sample Availability',
    description: 'At the Zar Experience Center, Mumbai as well as in leading trade shows across the country',
  },
  {
    icon: imagePath('/images/slt.svg'),
    title: 'Service Lead Times',
    description: 'Bulk: 7–10 business days Customer order: 5 business days',
  },
  {
    icon: imagePath('/images/rsa.svg'),
    title: 'Ready Stock Availability',
    description: '12 to 15 business days from order confirmation.',
  },
  {
    icon: imagePath('/images/za.svg'),
    title: 'Zar App',
    description:
      'Get real-time updates to latest designs at your fingertips through the Zar app. <a href="https://zarapp.link/register" target="_blank" rel="noopener noreferrer">Register now!</a>',
  },
];

function formatName(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function mapRelatedProduct(item: { id: string; name: string; description: string; image: string; purity: string; price: number }) {
  return {
    id: item.id,
    title: item.name,
    description: item.description,
    image: item.image,
    purity: item.purity,
    price: item.price,
  };
}

function renderTradeHighlight(item: TradeHighlight) {
  return (
    <article key={item.title} className={styles.highlightCard}>
      <div className={styles.highlightIcon} aria-hidden="true">
        <Image src={item.icon} alt="" width={48} height={48} />
      </div>
      <h3 className={styles.highlightTitle}>{item.title}</h3>
      <p
        className={styles.highlightDescription}
        dangerouslySetInnerHTML={{ __html: item.description }}
      />
    </article>
  );
}



export async function generateMetadata({ params }: Readonly<Props>) {
  const { purity, category, style, id } = await params;

  try {
    const { product } = await fetchProductDetail(purity, category, style, id);
    return {
      title: product.metaTitle || `${product.name} — Zar Jewels`,
      description: product.metaDescription || product.description,
      openGraph: {
        images: ['https://zar-one.vercel.app/images/zar-logo.svg'],
      },
    };
  } catch {
    return {
      title: 'Product Not Found — Zar Jewels',
      description: 'The requested product could not be found.',
      openGraph: {
        images: ['https://zar-one.vercel.app/images/zar-logo.svg'],
      },
    };
  }
}

export default async function ProductDetailPage({ params }: Readonly<Props>) {
  const { purity, category, style, id } = await params;

  let detail;

  try {
    detail = await fetchProductDetail(purity, category, style, id);
  } catch (error) {
    if (isCatalogRouteError(error)) {
      notFound();
    }

    throw error;
  }

  const product = detail.product;
  const related = detail.related;
  const purityLabel = product.goldTypeName || purity.toUpperCase();
  const categoryName = product.categoryName || formatName(category);
  const styleName = product.collectionTypeName || formatName(style);

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: `${purityLabel} Gold`, href: `/collections/${purity}` },
          { label: categoryName, href: `/collections/${purity}/${category}` },
          { label: styleName, href: `/collections/${purity}/${category}/${style}` },
          { label: product.name, isActive: true },
        ]}
      />
      <section>
        <div className="container mb-100">
          <div className={styles.grid}>
            <div className={styles.galleryColumn}>
              <div className={styles.mobProd}>
                <h1>{product.name}</h1>
                <div>{product.sku}</div>
              </div>
              <div className={styles.stickyGallery}>
                <ProductGallery images={product.images} />
              </div>
            </div>

            <div className={styles.infoColumn}>
              <ProductInfo
                product={{
                  id: product.id,
                  title: product.name,
                  sku: product.style,
                  description: product.description,
                  price: product.price,
                  image: product.image,
                  specifications: product.specifications || {},
                  purity: product.goldTypeName || product.purity.toUpperCase(),
                  pcs: product.pcs,
                  finish: product.finish,
                  technicalSpecs: product.technicalSpecs,
                  manufacturing: product.manufacturing,
                  manufacturingHtml: product.manufacturingHtml,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.tradeHighlights} aria-label="Trade highlights">
        <div className="container">
          <div className={styles.tradeHighlightsInner}>
            {TRADE_HIGHLIGHTS.map(renderTradeHighlight)}
          </div>
        </div>
      </section>

      {/* Mobile Trade Highlights Slider (≤576px) */}
      <TradeHighlightsSlider highlights={TRADE_HIGHLIGHTS} />

      <RelatedProductsSlider
        title="You might also like"
        products={related.map(mapRelatedProduct)}
        basePath={`/collections/${purity}/${category}/${style}`}
      />
    </div >
  );
}
