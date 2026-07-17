import PageHeaderSkeleton from '@/components/ui/PageHeader/PageHeaderSkeleton';
import ProductDetailSkeleton from '@/components/ui/organisms/ProductDetailSkeleton/ProductDetailSkeleton';

export default function ProductLoading() {
  return (
    <>
      <PageHeaderSkeleton showBanner={false} />
      <ProductDetailSkeleton />
    </>
  );
}
