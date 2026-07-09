import PageHeader from '@/components/ui/PageHeader/PageHeader';
import CollectionGrid from '@/components/ui/organisms/CollectionGrid/CollectionGrid';
import { fetchCategories, isCatalogRouteError } from '@/lib/api/catalog';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

interface Props {
  params: Promise<{ purity: string }>;
}

export async function generateMetadata({ params }: Readonly<Props>) {
  const { purity } = await params;
  const purityLabel = purity.toUpperCase();
  return {
    title: `${purityLabel} Gold Jewellery Categories — Zar Jewels`,
    description: `Explore our extensive collection of ${purityLabel} gold jewellery categories, featuring rings, bangles, necklaces, and more.`,
  };
}

export const dynamic = 'force-dynamic';

// export async function generateStaticParams(): Promise<Array<{ purity: string }>> {
//   // Provide known purity options for static export. If you need dynamic discovery,
//   // we can fetch available purities from the backend instead.
//   return [{ purity: '18k' }, { purity: '22k' }];
// }

export default async function CategoryListingPage({ params }: Readonly<Props>) {
  const { purity } = await params;
  const purityLabel = purity.toUpperCase();

  let categories;

  try {
    categories = await fetchCategories(purity);
  } catch (error) {
    if (isCatalogRouteError(error)) {
      notFound();
    }

    throw error;
  }

  const collections = categories.map((item) => ({
    id: item.slug,
    name: item.name,
    image: item.image,
    href: `/collections/${purity}/${item.slug}`,
  }));

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: `${purityLabel} Gold`, isActive: true },
        ]}
        heading={`${purityLabel} Gold Jewellery`}
        description={`Explore our curated range of ${purityLabel} gold jewellery categories, each designed to reflect a distinct style and impeccable craftsmanship.`}
      />
      <section className="mt-100 mb-100">
        <div className="container">
          <CollectionGrid collections={collections} />
        </div>
      </section>
    </div>
  );
}
