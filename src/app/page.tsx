import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/ui/organisms/HeroSection/HeroSection';
import LegacySection from '@/components/ui/organisms/LegacySection/LegacySection';
import HomeSectionSkeleton from '@/components/ui/organisms/HomeSectionSkeleton/HomeSectionSkeleton';

const ModelShowcaseSection = dynamic(
  () => import('@/components/ui/organisms/ModelShowcaseSection/ModelShowcaseSection'),
  { loading: () => <HomeSectionSkeleton height={520} /> },
);
const ManufacturingSection = dynamic(
  () => import('@/components/ui/organisms/ManufacturingSection/ManufacturingSection'),
  { loading: () => <HomeSectionSkeleton height={480} /> },
);
const CraftsmanshipSection = dynamic(
  () => import('@/components/ui/organisms/CraftsmanshipSection/CraftsmanshipSection'),
  { loading: () => <HomeSectionSkeleton height={420} /> },
);
const ModernWomanSection = dynamic(
  () => import('@/components/ui/organisms/ModernWomanSection/ModernWomanSection'),
  { loading: () => <HomeSectionSkeleton height={420} /> },
);
const ExhibitionsSection = dynamic(
  () => import('@/components/ui/organisms/ExhibitionsSection/ExhibitionsSection'),
  { loading: () => <HomeSectionSkeleton height={400} /> },
);
const RetailerSlider = dynamic(
  () => import('@/components/ui/organisms/RetailerSlider/RetailerSlider'),
  { loading: () => <HomeSectionSkeleton height={460} /> },
);
const InstagramSection = dynamic(
  () => import('@/components/ui/organisms/InstagramSection/InstagramSection'),
  { loading: () => <HomeSectionSkeleton height={400} /> },
);
const TrustedBrandsSection = dynamic(
  () => import('@/components/ui/organisms/TrustedBrandsSection/TrustedBrandsSection'),
  { loading: () => <HomeSectionSkeleton height={280} /> },
);

export const metadata: Metadata = {
  title: 'ZAR Jewels | Premium Gold Bangles & Jewellery Manufacturer',
  description: "Discover ZAR Jewels, India's trusted gold bangle manufacturer with 60+ years of craftsmanship. Explore premium gold jewellery, innovative designs & timeless elegance.",
  openGraph: {
    images: ['https://zar-one.vercel.app/images/zar-logo.svg'],
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <LegacySection />
      <ModelShowcaseSection />
      <ManufacturingSection />
      <CraftsmanshipSection />
      <ModernWomanSection />
      <ExhibitionsSection />
      <RetailerSlider />
      <InstagramSection />
      <TrustedBrandsSection />
    </>
  );
}
