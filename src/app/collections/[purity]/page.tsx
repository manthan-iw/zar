import PageHeader from '@/components/ui/PageHeader/PageHeader';
import CollectionGrid from '@/components/ui/organisms/CollectionGrid/CollectionGrid';
import { fetchCategories } from '@/lib/api/catalog';
import styles from './page.module.css';

interface Props {
  params: Promise<{ purity: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { purity } = await params;
  const purityLabel = purity.toUpperCase();
  return {
    title: `${purityLabel} Gold Jewellery Categories — Zar Jewels`,
    description: `Explore our extensive collection of ${purityLabel} gold jewellery categories, featuring rings, bangles, necklaces, and more.`,
  };
}

export default async function CategoryListingPage({ params }: Props) {
  const { purity } = await params;
  const purityLabel = purity.toUpperCase();

  const categories = await fetchCategories(purity)
    .then((items) =>
      items.map((item) => ({
        id: item.slug,
        name: item.name,
        image: item.image,
        href: `/collections/${purity}/${item.slug}`,
      }))
    )
    .catch(() => []);

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
          <CollectionGrid collections={categories} />
        </div>
      </section>
    </div>
  );
}
