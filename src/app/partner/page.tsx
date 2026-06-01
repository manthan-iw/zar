import PageHeader from '@/components/ui/PageHeader/PageHeader';
import Image from 'next/image';
import PartnerForm from './PartnerForm';
import styles from './page.module.css';

export const metadata = {
  title: 'Become a Partner — Zar Jewels',
  description: 'Partner with India\'s leading gold bangle manufacturer. Join the Zar network of trusted retailers.',
};

export default function PartnerPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Partner', isActive: true },
        ]}
        heading="Become a Partner"
        description="Collaborate with ZAR to grow your retail business with precision-crafted gold jewellery, supported by consistent quality, scalable manufacturing, and trusted supply."
      />

      <div className='bannerImage'>
        <Image
          src="/images/partner_bg.webp"
          alt="Crafting gold bangle"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      <div className={styles.content}>
        <div className="container">
          <h2 className="formHeading txt_center mt-100">Distributor Testimonials</h2>
          <div className={styles.benefitsGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.benefitCard}>
                <Image src="/images/Distributor-Testimonials.png" alt="Benefit" width={300} height={280} style={{ objectFit: 'cover' }} className='imgFluid'/>
                <h3 className={styles.benefitTitle}>Benefit Title {i}</h3>
                <p className={styles.benefitSubtitle}>Benefit subtitle description goes here.</p>
              </div>
            ))}
          </div>

          <div className={styles.grid}>
            <PartnerForm />
          </div>
        </div>
      </div>
    </div>
  );
}
