import PageHeaderSkeleton from '@/components/ui/PageHeader/PageHeaderSkeleton';
import ProductListingSkeleton from '@/components/ui/organisms/ProductListingSkeleton/ProductListingSkeleton';

export default function StyleLoading() {
  return (
    <>
      <PageHeaderSkeleton showBanner />
      <ProductListingSkeleton cardCount={6} />
    </>
  );
}
