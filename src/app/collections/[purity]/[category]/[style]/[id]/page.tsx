import PageHeader from '@/components/ui/PageHeader/PageHeader';
import ProductGallery from '@/components/ProductGallery/ProductGallery';
import ProductInfo from '@/components/ProductInfo/ProductInfo';
import RelatedProductsSlider from '@/components/RelatedProductsSlider/RelatedProductsSlider';
import { fetchProductDetail } from '@/lib/api/catalog';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

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
    icon: '/images/sa.svg',
    title: 'Sample Availability',
    description: 'Ready for viewing at our headquarters and major trade shows.',
  },
  {
    icon: '/images/bp.svg',
    title: 'Bulk Production',
    description: '12 to 15 business days from order confirmation.',
  },
  {
    icon: '/images/moq.svg',
    title: 'MOQ',
    description: '1 Piece (Custom) or 5+ Pieces for wholesale pricing.',
  },
];

function formatName(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: Props) {
  const { purity, category, style, id } = await params;

  try {
    const { product } = await fetchProductDetail(purity, category, style, id);
    return {
      title: `${product.name} — Zar Jewels`,
      description: product.description,
    };
  } catch {
    return {
      title: 'Product Not Found — Zar Jewels',
      description: 'The requested product could not be found.',
    };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { purity, category, style, id } = await params;

  const purityLabel = purity.toUpperCase();
  const categoryName = formatName(category);
  const styleName = formatName(style);

  const detail = await fetchProductDetail(purity, category, style, id).catch(() => null);

  if (!detail) {
    notFound();
  }

  const { product, related } = detail;

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
              <div className={styles.stickyGallery}>
                <ProductGallery images={product.images} />
              </div>
            </div>

            <div className={styles.infoColumn}>
              <ProductInfo
                product={{
                  title: product.name,
                  sku: product.sku,
                  description: product.description,
                  specifications: product.specifications || {},
                  purity: product.purity,
                  weight: product.weight,
                  finish: product.finish,
                  technicalSpecs: product.technicalSpecs,
                  manufacturing: product.manufacturing,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.tradeHighlights} aria-label="Trade highlights">
        <div className="container">
          <div className={styles.tradeHighlightsInner}>
            {TRADE_HIGHLIGHTS.map((item) => (
              <article key={item.title} className={styles.highlightCard}>
                <div className={styles.highlightIcon} aria-hidden="true">
                  <img src={item.icon} alt="" />
                </div>
                <h3 className={styles.highlightTitle}>{item.title}</h3>
                <p className={styles.highlightDescription}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

  <RelatedProductsSlider
    title="You might also like"
    products={related.map((item) => ({
      id: item.id,
      title: item.name,
      description: item.description,
      image: item.image,
    }))}
    basePath={`/collections/${purity}/${category}/${style}`}
  />
    </div >
  );
}
