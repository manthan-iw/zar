import Image from 'next/image';
import PageHeader from '@/components/ui/PageHeader/PageHeader';
import Button from '@/components/ui/atoms/Button/Button';
import styles from './page.module.css';

export const metadata = {
    title: 'Thank You — Zar Jewels',
    description: 'Thank you for contacting Zar Jewels. We have received your submission and will get back to you shortly.',
};

export default function ThankYouPage() {
    return (
        <div className={styles.page}>
            <div className="container">
                <div className='bannerImage'>
                    <Image
                        src="/images/thank-you.webp"
                        alt="Thank you for contacting Zar Jewels"
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>
            </div>

            <section className={styles.thankYouSection}>
                <div className="container">
                    <div className={styles.card}>
                        <h1>Thank You</h1>
                        <p>We've received your submission and will get back to you shortly.</p>
                        <Button href="/" variant="primary" showArrow>
                            Back to Home
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
