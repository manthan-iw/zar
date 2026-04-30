import PageHeader from '@/components/ui/PageHeader/PageHeader';
import CollectionGrid from '@/components/ui/organisms/CollectionGrid/CollectionGrid';
import { fetchStyles } from '@/lib/api/catalog';
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

export async function generateMetadata({ params }: Props) {
  const { purity, category } = await params;
  const purityLabel = purity.toUpperCase();
  const categoryName = formatName(category);

  return {
    title: `${categoryName} Styles in ${purityLabel} Gold — Zar Jewels`,
    description: `Explore our various styles of ${categoryName} in ${purityLabel} gold, from plain and handmade to fancy and enamel.`,
  };
}

export default async function StyleListingPage({ params }: Props) {
  const { purity, category } = await params;
  const purityLabel = purity.toUpperCase();
  const categoryName = formatName(category);

  const stylesList = await fetchStyles(purity, category)
    .then((items) =>
      items.map((item) => ({
        id: item.slug,
        name: item.name,
        image: item.image,
        href: `/collections/${purity}/${category}/${item.slug}`,
      }))
    )
    .catch(() => []);

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
          <CollectionGrid collections={stylesList} />
        </div>
      </section>
    </div>
  );
}
