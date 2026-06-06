import Link from 'next/link';
import Image from 'next/image';
import TypingText from '../../atoms/TypingText/TypingText';
import styles from './Footer.module.css';

const linkCol1 = [
  { label: 'Home', href: '/' },
  { label: 'Story of Zar', href: '/about' },
  { label: 'Our Clientele', href: '/clientele' },
  { label: 'Become a Partner', href: '/partner' },
];

const linkCol2 = [
  { label: 'Event', href: '/event' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blogs', href: '#' },
  { label: 'Contact', href: '/contact' },
];

const collectionsLinks = [
  { label: '18K Jewellery', href: '/collections/18k' },
  { label: '22K Jewellery', href: '/collections/22k' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* ── Quote + Footer Top Wrapper ── */}
      <div className={styles.footerBgWrapper}>
        <div className="container">
          {/* ── Quote ── */}
          <div className={styles.quoteSection}>
            <div className={styles.quoteInner}>
              <span className={styles.quoteMarkLeft}>&ldquo;</span>
              <p className={styles.quoteText}>
                <TypingText text="Excellence is not a skill, it's an attitude" speed={100} />
              </p>
              <span className={styles.quoteMarkRight}>&ldquo;</span>
            </div>
          </div>

          {/* ── Footer Top ── */}
          <div className={styles.footerTop}>
            <div className={styles.topInner}>
              <div className={styles.brand}>
                <Image
                  src="/images/zar-logo.svg"
                  alt="Zar Jewels"
                  width={150}
                  height={60}
                  className={styles.brandLogo}
                />
                <p className={styles.brandText}>
                  Six decades of crafting lightweight, elegant gold bangles through innovation, precision, and timeless craftsmanship.
                </p>
                <div className={styles.socials}>
                  <a href="#" aria-label="Facebook" className={`jelly ${styles.socialLink}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_1_645)">
                        <path d="M12 0C18.6274 0 24 5.37259 24 12C24 18.1352 19.3955 23.1944 13.4538 23.9121V15.667L16.7001 15.667L17.3734 12H13.4538V10.7031C13.4538 9.73417 13.6439 9.06339 14.0799 8.63483C14.5159 8.20627 15.1979 8.01993 16.1817 8.01993C16.4307 8.01993 16.6599 8.02241 16.8633 8.02736C17.1591 8.03456 17.4002 8.047 17.568 8.06467V4.74048C17.501 4.72184 17.4218 4.70321 17.3331 4.68486C17.1321 4.6433 16.8822 4.60324 16.6136 4.56806C16.0523 4.49453 15.4093 4.4423 14.9594 4.4423C13.1424 4.4423 11.7692 4.83102 10.8107 5.63619C9.65388 6.60791 9.10108 8.18622 9.10108 10.4199V12H6.62659V15.667H9.10108V23.6466C3.87432 22.3498 0 17.6277 0 12C0 5.37259 5.37259 0 12 0Z" fill="#D0B480" />
                      </g>
                      <defs>
                        <clipPath id="clip0_1_645">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>


                  </a>
                  <a href="#" aria-label="Instagram" className={`jelly ${styles.socialLink}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.3952 7.02212C17.6005 7.02368 16.9543 6.3802 16.9528 5.58548C16.9512 4.79076 17.5947 4.14457 18.3898 4.14302C19.1848 4.14146 19.831 4.78531 19.8326 5.58004C19.8338 6.37476 19.1903 7.02057 18.3952 7.02212Z" fill="#D0B480" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M12.0115 18.161C8.60909 18.1676 5.8451 15.4149 5.8385 12.0117C5.83188 8.60923 8.58536 5.84481 11.9878 5.8382C15.3909 5.83159 18.1553 8.5859 18.1619 11.9879C18.1685 15.3912 15.4143 18.1544 12.0115 18.161ZM11.992 8.00035C9.78365 8.00424 7.99594 9.79858 7.99983 12.0074C8.0041 14.2166 9.79882 16.0039 12.0072 15.9996C14.2164 15.9954 16.0041 14.2014 15.9998 11.9922C15.9955 9.78302 14.2008 7.99608 11.992 8.00035Z" fill="#D0B480" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M4.1192 0.646479C4.88126 0.347876 5.75333 0.143362 7.03015 0.0830982C8.31011 0.0216726 8.71872 0.00767102 11.9769 0.00145262C15.2358 -0.00476578 15.6444 0.00766862 16.9244 0.0644334C18.2016 0.119643 19.0741 0.321049 19.8377 0.616544C20.6277 0.920974 21.298 1.33078 21.966 1.99603C22.6339 2.66205 23.0453 3.33002 23.3536 4.1189C23.6518 4.88174 23.8563 5.75306 23.917 7.03068C23.9776 8.31023 23.9924 8.71847 23.9986 11.9771C24.0048 15.2353 23.9916 15.6443 23.9356 16.925C23.88 18.2014 23.679 19.0743 23.3835 19.8375C23.0783 20.6276 22.6693 21.2979 22.004 21.9659C21.3388 22.6342 20.6701 23.0452 19.8812 23.3539C19.1184 23.6517 18.2471 23.8562 16.9702 23.9173C15.6903 23.9779 15.2817 23.9923 12.0224 23.9985C8.76459 24.0048 8.35598 23.9923 7.07605 23.9359C5.79882 23.88 4.92597 23.6789 4.16275 23.3838C3.37271 23.0782 2.70242 22.6696 2.03446 22.004C1.36611 21.3383 0.954386 20.67 0.646458 19.8811C0.347858 19.1186 0.144107 18.2469 0.0830727 16.9705C0.0220359 15.6901 0.00765506 15.2811 0.00143906 12.0229C-0.00480094 8.76435 0.00803667 8.35611 0.0640167 7.07616C0.1204 5.79855 0.320637 4.92606 0.61613 4.16206C0.921328 3.37239 1.33035 2.70248 1.99637 2.03413C2.6616 1.36616 3.33033 0.954017 4.1192 0.646479ZM4.94154 21.3679C5.36494 21.5308 6.00023 21.7252 7.17014 21.7761C8.43607 21.8309 8.81514 21.843 12.0185 21.8368C15.223 21.8309 15.6021 21.8173 16.8676 21.7579C18.0363 21.7022 18.6716 21.5055 19.0939 21.3407C19.6541 21.1218 20.0531 20.8601 20.4722 20.4406C20.8913 20.0195 21.1506 19.6194 21.3676 19.0591C21.5309 18.6354 21.7249 17.9996 21.7758 16.8297C21.8314 15.5646 21.8431 15.1851 21.8368 11.9809C21.831 8.77757 21.8174 8.3981 21.7572 7.13254C21.7019 5.96339 21.5056 5.32808 21.3404 4.90623C21.1215 4.34519 20.8606 3.94705 20.4399 3.52753C20.0192 3.10801 19.6191 2.84945 19.0581 2.6325C18.6355 2.46881 17.9994 2.27518 16.8303 2.22426C15.5643 2.16865 15.1849 2.15737 11.9808 2.1636C8.77743 2.16982 8.39836 2.18264 7.13281 2.24253C5.9633 2.29812 5.32877 2.49447 4.90575 2.65972C4.34587 2.87861 3.94696 3.13872 3.52746 3.5598C3.10871 3.98087 2.84938 4.38018 2.63244 4.94161C2.46993 5.36464 2.27434 6.00072 2.2242 7.16987C2.16898 8.43581 2.15733 8.81529 2.16355 12.0187C2.16939 15.2228 2.18298 15.6023 2.24248 16.8671C2.29729 18.037 2.49518 18.6715 2.65966 19.0949C2.87855 19.6544 3.13944 20.0533 3.55973 20.4729C3.98081 20.8908 4.38088 21.1509 4.94154 21.3679Z" fill="#D0B480" />
                    </svg>

                  </a>
                  {/* App Store */}
                  <a
                    href="javascript:void(0)" // Replace with actual App Store link
                    aria-label="Download on the App Store"
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/images/App-Store.svg" alt="Download on the App Store" style={{ height: 32 }} className='imgFluid' />
                  </a>
                  {/* Google Play */}
                  <a
                    href="javascript:void(0)" // Replace with actual Play Store link
                    aria-label="Get it on Google Play"
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/images/Google-play.svg" alt="Get it on Google Play" style={{ height: 32 }} className='imgFluid' />
                  </a>
                </div>
              </div>

              <div className={styles.linksGrid}>
                <div className={styles.linksColumn}>
                  <h4 className={styles.linksTitle}>Links</h4>
                  <ul className={styles.linksList}>
                    {linkCol1.map((l) => (
                      <li key={l.href + l.label}>
                        <Link href={l.href} className={styles.linkItem}>{l.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.linksColumn}>
                  <h4 className={styles.linksTitle}>&nbsp;</h4>
                  <ul className={styles.linksList}>
                    {linkCol2.map((l) => (
                      <li key={l.href + l.label}>
                        <Link href={l.href} className={styles.linkItem}>{l.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.linksColumn}>
                  <h4 className={styles.linksTitle}>Collections</h4>
                  <ul className={styles.linksList}>
                    {collectionsLinks.map((l) => (
                      <li key={l.href + l.label}>
                        <Link href={l.href} className={styles.linkItem}>{l.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.contactColumn}>
                <h4 className={styles.linksTitle}>Contact</h4>
                <ul className={styles.contactList}>
                  <li className={styles.contactItem}>
                    <svg
                      className={styles.contactIcon}
                      width="19"
                      height="25"
                      viewBox="0 0 19 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.00112 2.97887C4.70732 1.32628 6.76248 0.5 9.16667 0.5C11.5709 0.5 13.6163 1.31689 15.3031 2.9507C16.9899 4.58451 17.8333 6.56572 17.8333 8.89437C17.8333 10.0587 17.5328 11.392 16.9318 12.8944C16.3307 14.3967 15.6037 15.8052 14.7506 17.1197C13.8975 18.4343 13.0541 19.6643 12.2204 20.8099C11.3866 21.9554 10.679 22.8662 10.0973 23.5423L9.16667 24.5C8.934 24.2371 8.62379 23.8897 8.23602 23.4577C7.84825 23.0258 7.15027 22.162 6.14206 20.8662C5.13385 19.5704 4.25168 18.3122 3.49553 17.0915C2.73937 15.8709 2.05108 14.4906 1.43065 12.9507C0.810213 11.4108 0.5 10.0587 0.5 8.89437C0.5 6.56572 1.3337 4.5939 3.00112 2.97887Z"
                        stroke="#D0B480"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.5 9.16667C10.5 9.90305 9.90305 10.5 9.16667 10.5C8.43029 10.5 7.83333 9.90305 7.83333 9.16667C7.83333 8.43029 8.43029 7.83333 9.16667 7.83333C9.90305 7.83333 10.5 8.43029 10.5 9.16667Z"
                        stroke="#D0B480"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Ground floor, Peninsula spenta, Mathuradas mill compound, N. M. Joshi Marg, Lower Parel(W), Mumbai - 400 013.</span>
                  </li>
                  <li className={styles.contactItem}>
                    <svg
                      className={styles.contactIcon}
                      width="25"
                      height="20"
                      viewBox="0 0 25 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.5 4.5L12.145 12.2633C12.36 12.4066 12.64 12.4066 12.855 12.2633L24.5 4.5M1.14 19.1667H23.86C24.2135 19.1667 24.5 18.8801 24.5 18.5267V1.14C24.5 0.786538 24.2135 0.5 23.86 0.5H1.14C0.786538 0.5 0.5 0.786537 0.5 1.14V18.5267C0.5 18.8801 0.786537 19.1667 1.14 19.1667Z"
                        stroke="#D0B480"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>info@zarjewels.com</span>
                  </li>
                  <li className={styles.contactItem}>
                    <svg
                      className={styles.contactIcon}
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.500246 2.38746C0.81717 14.0176 10.9824 24.1828 22.6125 24.4998C22.9367 24.5086 23.217 24.2785 23.2806 23.9604L24.4867 17.9299C24.5469 17.629 24.3983 17.3251 24.1239 17.1879L19.4269 14.8394C19.1328 14.6924 18.7756 14.7767 18.5783 15.0397L16.997 17.1482C16.8685 17.3195 16.6676 17.4255 16.4559 17.3934C13.6009 16.9598 8.04024 11.3991 7.60663 8.54412C7.57448 8.3324 7.68052 8.1315 7.85184 8.00301L9.96027 6.42169C10.2233 6.2244 10.3076 5.86723 10.1606 5.57314L7.81209 0.876145C7.67488 0.601727 7.37098 0.453094 7.07013 0.513264L1.03956 1.71938C0.721545 1.78298 0.491412 2.06326 0.500246 2.38746Z"
                        stroke="#D0B480"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Office No. : +91 86574 99151</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer Bottom ── */}
      <div className={styles.footerBottom}>
        <div className={styles.bottomInner}>
          <p className={styles.copyright}>&copy; 2026 Zar Gold Bangles. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <span className={styles.separator}>|</span>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
