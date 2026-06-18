import type { Metadata } from 'next';
import styles from './page.module.css';
import Image from 'next/image';
import { imagePath } from '@/lib/imagePath';
import PageHeader from '@/components/ui/PageHeader/PageHeader';
import OurStory from '@/components/ui/OurStory/OurStory';

export const metadata: Metadata = {
  title: 'About ZAR Jewels | 60+ Years of Gold Jewellery Excellence',
  description: 'Learn the story of ZAR Jewels, a leading gold jewellery manufacturer known for exceptional craftsmanship, innovative designs, quality, and trusted partnerships worldwide.',
  openGraph: {
    images: ['https://zar-one.vercel.app/images/zar-logo.svg'],
  },
};

export default function AboutPage() {

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'The Story of Zar', isActive: true }
        ]}
        heading="THE STORY OF ZAR"
        description="ZAR began with a singular pursuit—perfecting the craft of gold bangles through precision, consistency, and trust."
      />
      <div className='bannerImage'>
        <Image
          src={imagePath("/images/about/about_banner.webp")}
          alt="Crafting gold bangle"
          fill
          style={{ objectFit: 'cover' }}
          priority
          className="imgFluid"
        />
      </div>

      {/* Section 2: Static Description */}
      <section className="mb-100">
        <div className="container">
          <p>
            Over time, that pursuit evolved into something greater: a disciplined system of excellence shaped by innovation and continuous improvement. Today, with a strong presence across India and Dubai, ZAR stands as a premium jewellery house—defined not only by what it creates, but by the standards it upholds.<br /><br />
          </p>
          <p>
            <strong className="txt_black">Because at ZAR, the benchmark is always rising</strong>.
          </p>
        </div>
      </section>

      {/* dynamic section */}
      <OurStory />
      {/* dynamic section */}
      {/* 2 para secion */}
      <section className="mt-100 mb-100">
        <div className={styles.paraSection}>
          <div className="container">
            <p>Across generations, one belief has remained constant: there is always a higher standard to pursue.</p>
            <p>This belief defines ZAR today not just as a legacy, but as a journey in motion.</p>
          </div>
        </div>
      </section>
      {/* 2 para secion */}

      <section className={styles.aboutSection}>
        <div className="container">
          <div className="storyGrid">
            <div className="storyImageWrapper">
              <Image src={imagePath("/images/about/new_abt.png")} alt="Zar team at work" fill className="storyImage" />
            </div>
            <div className="storyTextBlock">
              <h2 className="fs_54">Legacy That Built the Foundation</h2>
              <p>
                Driven by Discipline. Defined by Progress.
              </p>
              <p>
                For three generations, ZAR has crafted gold with a clear belief true luxury should feel effortless, even when built on precision. Because what appears simple is rarely so. It is the result of consistency, control, and uncompromising standards.
              </p>
              <p>
                Blending heritage craftsmanship with modern design, every piece is made to be worn with ease and to endure over time.
              </p>
              <p>
                The foundation of ZAR extends beyond craftsmanship.<br />
                It lies in ownership—of process, detail, and outcome.
              </p>
              <p>This mindset has built lasting trust, strong partnerships, and a reputation grounded in reliability.</p>
            </div>
          </div>
        </div>
      </section>


      {/* Vision & Mission Section */}
      <section className={styles.visionMissionSection}>
        <div className="container">
          <div className={styles.visionMissionGrid}>
            <div className={styles.visionCard}>
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_1_1274" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="90" height="90">
                  <path d="M89 1V89H1V1H89Z" fill="white" stroke="white" strokeWidth="2" />
                </mask>
                <g mask="url(#mask0_1_1274)">
                  <mask id="mask1_1_1274" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="90" height="90">
                    <path d="M89 89V1H1V89H89Z" fill="white" stroke="white" strokeWidth="2" />
                  </mask>
                  <g mask="url(#mask1_1_1274)">
                    <path d="M44.9995 68.5078C32.0184 68.5078 21.4951 57.9845 21.4951 45.0034C21.4951 32.0223 32.0184 21.499 44.9995 21.499C57.9806 21.499 68.5039 32.0223 68.5039 45.0034C68.5039 57.9845 57.9806 68.5078 44.9995 68.5078Z" stroke="black" strokeWidth="2" strokeMiterlimit="10" />
                    <path d="M45.0003 56.5254C38.6345 56.5254 33.4741 51.365 33.4741 44.9992C33.4741 38.6335 38.6345 33.4729 45.0003 33.4729C51.366 33.4729 56.5264 38.6335 56.5264 44.9992C56.5264 51.365 51.366 56.5254 45.0003 56.5254Z" stroke="black" strokeWidth="2" strokeMiterlimit="10" />
                    <path d="M51.3496 26.9727C57.5795 29.1737 62.3379 34.5186 63.7086 41.0918" stroke="black" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="20 13.33 20 13.33 866.67 20 13.33 20" />
                    <path d="M88.297 45.0034C88.297 45.0034 68.9124 68.5078 45 68.5078C21.0877 68.5078 1.70312 45.0034 1.70312 45.0034C1.70312 45.0034 21.0877 21.499 45 21.499C68.9124 21.499 88.297 45.0034 88.297 45.0034Z" stroke="black" strokeWidth="2" strokeMiterlimit="10" />
                    <path d="M45 14.2372C52.6743 14.2372 59.8349 17.0905 65.3145 21.9023" stroke="black" strokeWidth="2" strokeMiterlimit="10" strokeDasharray="20 13.33 20 13.33 866.67 20 13.33 20" />
                    <path d="M43.6816 45H46.3184" stroke="black" strokeWidth="2" strokeMiterlimit="10" />
                    <path d="M44.9995 41.0918V25.5656" stroke="black" strokeWidth="2" strokeMiterlimit="10" />
                    <path d="M44.9995 48.9083V64.4346" stroke="black" strokeWidth="2" strokeMiterlimit="10" />
                    <path d="M48.9062 45H64.4323" stroke="black" strokeWidth="2" strokeMiterlimit="10" />
                    <path d="M41.0931 45H25.5669" stroke="black" strokeWidth="2" strokeMiterlimit="10" />
                    <path d="M76.6185 29.625C70.9137 17.9164 58.9005 9.84715 44.9997 9.84715C31.0989 9.84715 19.0857 17.9164 13.3809 29.625" stroke="black" strokeWidth="2" strokeMiterlimit="10" />
                    <path d="M13.3809 60.3784C19.0857 72.087 31.0989 80.1562 44.9997 80.1562C58.9005 80.1562 70.9137 72.087 76.6185 60.3784" stroke="black" strokeWidth="2" strokeMiterlimit="10" />
                  </g>
                </g>
              </svg>
              <h3>VISION</h3>
              <p>To craft jewellery that transcends ornamentation becoming a symbol of identity, legacy, and enduring elegance.</p>
            </div>
            <div className={styles.missionCard}>
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_1_1318" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="90" height="90">
                  <path d="M89 1V89H1V1H89Z" fill="white" stroke="white" strokeWidth="2" />
                </mask>
                <g mask="url(#mask0_1_1318)">
                  <mask id="mask1_1_1318" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="-1" width="90" height="91">
                    <path d="M89 88.9971V0.99707H1V88.9971H89Z" fill="white" stroke="white" strokeWidth="2" />
                  </mask>
                  <g mask="url(#mask1_1_1318)">
                    <path d="M1.31885 85.8618H88.6821" stroke="black" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16.1138 69.1284L31.5465 38.0953C31.9445 37.295 32.9777 37.0626 33.6799 37.6158L37.0152 40.2421" stroke="black" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M56.5175 63.0946L53.8627 67.4087C52.6865 69.3201 50.8934 70.7733 48.7798 71.5281L35.5072 76.2682C33.3991 77.0213 31.4467 78.1542 29.747 79.611L22.4546 85.8618" stroke="black" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M85.8639 85.8618L65.7584 55.7034C64.6182 53.9936 62.0903 54.0394 61.0133 55.7897L59.4932 58.2599" stroke="black" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M34.3414 47.3237L29.3118 59.0594C28.5172 60.9134 27.1734 62.479 25.4614 63.5457L13.2049 71.182C11.9379 71.9714 10.9024 73.0825 10.2038 74.4019L4.13672 85.8618" stroke="black" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M60.5 56.2715L47.6485 28.2317C46.63 26.0097 43.4591 26.0491 42.4963 28.2957L36.4814 42.3303" stroke="black" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M45 4.13502V26.0933" stroke="black" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M45 5.54398H57.6817L54.8636 9.77117L57.6817 13.9985H45" stroke="black" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M33.8154 49.1371L39.2571 56.6627C40.499 58.3804 43.1429 58.0745 43.9599 56.1186L46.1495 50.8766C46.9422 48.9789 49.4756 48.6186 50.7664 50.2198C51.7787 51.4761 53.6571 51.5766 54.7979 50.4358L56.4488 48.7848" stroke="black" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </g>
              </svg>
              <h3>MISSION</h3>
              <p>To build a globally respected gold jewellery house driven by excellence, innovation, and continuous growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="storySection">
        <div className="container">
          <div className="storyGrid">
            <div className="storyImageWrapper">
              <Image src={imagePath("/images/about/abt-4.jpg")} alt="Zar team at work" fill className="storyImage imgFluid h-full" />
            </div>
            <div className="storyTextBlock">
              <h2 className="fs_54">Design & Innovation</h2>
              <p>
                <strong className="txt_black">Precision, Engineered.</strong>
              </p>
              <p>At ZAR, design is not just expression it is execution.</p>
              <p>We create ultra-light, design-led gold jewellery that merges heritage craftsmanship with modern engineering—crafted for those who value precision, comfort, and refinement.</p>
              <p className='txt_black'>Every piece is developed with intent:</p>
              <p>to make gold lighter, stronger, and more wearable—without compromising presence.</p>
              <ul className={styles.designList}>
                <li>Lightweight engineering reducing weight by 20–30% while maintaining strength</li>
                <li>Reverse hollow constructions for enhanced comfort</li>
                <li>Laser-welded forms enabling seamless, bold designs</li>
                <li>A blend of handcrafted artistry and CNC precision for consistent detailing</li>
              </ul>
              <p>Innovation, for us, is not feature-driven. It is progress-driven.</p>
              <p className='txt_black'>We don’t follow trends.<br /> We set new benchmarks.</p>
              <p style={{ color: '#A38274' }}>Because there is always a better way to create—and we are committed to finding it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="valuesSection mt-100 mb-100">
        <div className="container">
          <h2 className="fs_54 txt_center">OUR VALUES</h2>
          <p className="valuesSectionSubtitle">Timeless craftsmanship, uncompromising quality, and trust carried through generations.</p>
          <div className="valuesGrid">
            <div className="valueCard">
              <div className="valueIcon">
                <Image src={imagePath("/images/about/rc.svg")} alt="Zar team at work" height={130} width={130} />
              </div>
              <h4>Relentless Craftsmanship</h4>
              <p>We pursue excellence as a standard—refining every detail without compromise.</p>
            </div>
            <div className="valueCard">
              <div className="valueIcon">
                <Image src={imagePath("/images/about/om.svg")} alt="Zar team at work" height={130} width={130} />
              </div>
              <h4>Ownership Mindset</h4>
              <p>We take full responsibility for everything we create and deliver.</p>
            </div>
            <div className="valueCard">
              <div className="valueIcon">
                <Image src={imagePath("/images/about/pdi.svg")} alt="Zar team at work" height={130} width={130} />
              </div>
              <h4>Purpose-Driven Innovation</h4>
              <p>We innovate with intent—to lead, not follow.</p>
            </div>
            <div className="valueCard">
              <div className="valueIcon">
                <Image src={imagePath("/images/about/doh.svg")} alt="Zar team at work" height={130} width={130} />
              </div>
              <h4>Discipline Over Hype</h4>
              <p>We value consistency, precision, and execution over noise.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
