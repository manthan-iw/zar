import Image from 'next/image';
import PageHeader from '@/components/ui/PageHeader/PageHeader';
import { fetchProducts, fetchStyles, fetchCategories, isCatalogRouteError } from '@/lib/api/catalog';
import { notFound } from 'next/navigation';
import ProductListingClient from './ProductListingClient';
import styles from './page.module.css';

interface Props {
  params: Promise<{ purity: string; category: string; style: string }>;
}

function formatName(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: Readonly<Props>) {
  const { purity, category, style } = await params;
  const purityLabel = purity.toUpperCase();
  const categoryName = formatName(category);
  const styleName = formatName(style);

  return {
    title: `${styleName} ${categoryName} in ${purityLabel} Gold — Zar Jewels`,
    description: `Shop our exclusive ${styleName} ${categoryName} collection crafted in ${purityLabel} gold.`,
  };
}

export async function generateStaticParams(): Promise<Array<{ purity: string; category: string; style: string }>> {
  const purities = ['18k', '22k'];
  const results: Array<{ purity: string; category: string; style: string }> = [];

  for (const purity of purities) {
    try {
      const categories = await fetchCategories(purity);
      for (const cat of categories) {
        try {
          const styles = await fetchStyles(purity, cat.slug);
          for (const s of styles) {
            results.push({ purity, category: cat.slug, style: s.slug });
          }
        } catch {
          // skip styles for this category if fetch fails
        }
      }
    } catch {
      // skip this purity if fetch fails
    }
  }

  return results;
}

export default async function ProductListingPage({ params }: Readonly<Props>) {
  const { purity, category, style } = await params;
  const purityLabel = purity.toUpperCase();
  const categoryName = formatName(category);
  const styleName = formatName(style);

  let products;

  try {
    products = await fetchProducts(purity, category, style);
  } catch (error) {
    if (isCatalogRouteError(error)) {
      notFound();
    }

    throw error;
  }

  const productCards = products.map((item) => ({
    id: item.id,
    title: item.name,
    description: item.description,
    image: item.image,
    price: item.price,
  }));

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: `${purityLabel} Gold`, href: `/collections/${purity}` },
          { label: categoryName, href: `/collections/${purity}/${category}` },
          { label: styleName, isActive: true },
        ]}
      />
      <div className="bannerImage">
        <Image
          src="/images/about/about_banner.webp"
          alt="Crafting gold bangle"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <ProductListingClient
        heading={`${styleName} ${categoryName}`}
        description={`The ${styleName} collection brings together the sparkle of Cubic Zircon (CZ) stones with the radiance of gold. The resulting product is a beautiful amalgamation of signity handwork on a gold bangle, giving it a truly exquisite look.`}
        products={productCards}
      />
    </div>
  );
}
