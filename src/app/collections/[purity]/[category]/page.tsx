import PageHeader from '@/components/ui/PageHeader/PageHeader';
import CollectionGrid from '@/components/ui/organisms/CollectionGrid/CollectionGrid';
import { fetchStyles, fetchCategories, isCatalogRouteError } from '@/lib/api/catalog';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

interface Props {
  params: Promise<{ purity: string; category: string }>;
}

function formatName(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: Readonly<Props>) {
  const { purity, category } = await params;
  const purityLabel = purity.toUpperCase();
  const categoryName = formatName(category);

  return {
    title: `${categoryName} Styles in ${purityLabel} Gold — Zar Jewels`,
    description: `Explore our various styles of ${categoryName} in ${purityLabel} gold, from plain and handmade to fancy and enamel.`,
  };
}

export async function generateStaticParams(): Promise<Array<{ purity: string; category: string }>> {
  const purities = ['18k', '22k'];
  const results: Array<{ purity: string; category: string }> = [];

  for (const purity of purities) {
    try {
      const categories = await fetchCategories(purity);
      for (const cat of categories) {
        results.push({ purity, category: cat.slug });
      }
    } catch (e) {
      // if fetching fails during build, skip this purity
      // leave params empty so build can continue for available data
      // console.warn can be used but avoid side-effects in server build
    }
  }

  return results;
}

export default async function StyleListingPage({ params }: Readonly<Props>) {
  const { purity, category } = await params;
  const purityLabel = purity.toUpperCase();
  const categoryName = formatName(category);

  let stylesList;

  try {
    stylesList = await fetchStyles(purity, category);
  } catch (error) {
    if (isCatalogRouteError(error)) {
      notFound();
    }

    throw error;
  }

  const collections = stylesList.map((item) => ({
    id: item.slug,
    name: item.name,
    image: item.image,
    href: `/collections/${purity}/${category}/${item.slug}`,
  }));

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: `${purityLabel} Gold`, href: `/collections/${purity}` },
          { label: categoryName, isActive: true },
        ]}
        heading={categoryName}
        description="From traditional artistry to contemporary design, discover collections that define elegance across generations. <br/> <br/> Explore our curated range of gold bangle collections, each designed to reflect a distinct style—from timeless traditions to modern elegance. Every piece is crafted with precision, combining advanced techniques with the artistry of skilled craftsmen."
      />
      <section className="mt-100 mb-100">
        <div className="container">
          <CollectionGrid collections={collections} />
        </div>
      </section>
    </div>
  );
}
