'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import Button from '@/components/ui/atoms/Button/Button';
import styles from './page.module.css';
import Image from 'next/image';
import PageHeader from '@/components/ui/PageHeader/PageHeader';
import CareerSlider from './CareerSlider';
import SelectField from '@/components/ui/atoms/SelectField/SelectField';
import InputField from '@/components/ui/atoms/InputField/InputField';
import PhoneField from '@/components/ui/atoms/PhoneField/PhoneField';
import CustomCaptcha from '@/components/ui/molecules/CustomCaptcha/CustomCaptcha';
import { fetchCareerPositions, submitCareerApplication } from '@/lib/api/careers';
import type { CareerPosition } from '@/types/domain';
import { useToast } from '@/components/ui/Toast/ToastContext';

type CareerFormValues = {
  fullName: string;
  companyName: string;
  role: string;
  workExperience: string;
  email: string;
  contactNumber: string;
  resume: FileList | undefined;
};

const NAME_REGEX = /^[A-Za-z][A-Za-z\s'.-]{1,79}$/;
const COMPANY_REGEX = /^[A-Za-z0-9][A-Za-z0-9\s'&.,()-]{1,99}$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const WORK_REGEX = /^[A-Za-z0-9\s+-]{1,30}$/;


export default function CareersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [positions, setPositions] = useState<CareerPosition[]>([]);
  const [captchaValue, setCaptchaValue] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0);
  const [resumeFileName, setResumeFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const openingsRef = useRef<HTMLElement>(null);

  const handleCaptchaStatusChange = useCallback(
    ({ value, isValid }: { value: string; isValid: boolean }) => {
      setCaptchaValue(value);
      setIsCaptchaValid(isValid);
    },
    []
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLElement>, onChange: (v: FileList | undefined) => void) => {
      event.preventDefault();
      setIsDragging(false);
      const files = event.dataTransfer.files;
      if (!files?.[0]) return;

      const allowed = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowed.includes(files[0].type)) return;
      if (files[0].size > 5 * 1024 * 1024) return;

      const dt = new DataTransfer();
      dt.items.add(files[0]);
      onChange(dt.files);
      setResumeFileName(files[0].name);
    },
    []
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CareerFormValues>({
    defaultValues: {
      fullName: '',
      companyName: '',
      role: '',
      workExperience: '',
      email: '',
      contactNumber: '',
      resume: undefined,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    let cancelled = false;

    fetchCareerPositions()
      .then((items) => {
        if (!cancelled && items.length > 0) {
          setPositions(items);
        }
      })
      .catch(() => {
        // Keep fallback positions on API failure.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToOpenings = () => {
    openingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleApplyNow = (positionTitle: string) => {
    setValue('role', positionTitle);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const onCareerSubmit = handleSubmit(async (values) => {
    if (!captchaValue || !isCaptchaValid) {
      showToast('Please complete the 4-digit captcha correctly before submitting.', 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('fullName', values.fullName || '');
      formData.append('companyName', values.companyName || '');
      formData.append('role', values.role || '');
      formData.append('workExperience', values.workExperience || '');
      formData.append('email', values.email || '');
      formData.append('contactNumber', values.contactNumber || '');
      if (values.resume?.[0]) {
        formData.append('cvFile', values.resume[0]);
      }

      await submitCareerApplication(formData);
      reset();
      setResumeFileName('');
      setCaptchaValue('');
      setIsCaptchaValid(false);
      router.push('/thank-you');
    } catch (error: unknown) {
      showToast(
        error instanceof Error
          ? error.message
          : 'Network error. Please try again in a moment.',
        'error'
      );
    } finally {
      setCaptchaRefreshKey((current) => current + 1);
    }
  });

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Careers', isActive: true }
        ]}
        heading="Build Your Career with ZAR"
        description="Be part of a team where craftsmanship meets innovation. At ZAR, we combine traditional artistry with modern precision to create jewellery defined by quality and design."
      />
      <div className='bannerImage'>
        <Image
          src="/images/career/career-banner.webp"
          alt="Crafting gold bangle"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      {/* Section 2: Static Description */}
      <section className={styles.descriptionSection}>
        <div className="container">
          <p>
            Be part of a team where craftsmanship meets innovation. At ZAR, we combine traditional artistry with modern precision to create jewellery defined by quality and design.
          </p>
          <div className={styles.btn_wrapper}>
            {positions.length > 0 && (
              <Button variant="primary" showArrow onClick={scrollToOpenings}>
                View Open Positions
              </Button>
            )}
            <Button variant="primary" showArrow onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
              Apply Now
            </Button>
          </div>
        </div>
      </section>
      {/* Our Story Section */}
      <section className="storySection mt-100">
        <div className="container">
          <div className="storyGrid">
            <div className="storyImageWrapper">
              <Image src="/images/about/about_1.png" alt="Zar team at work" fill className="storyImage" />
            </div>
            <div className="storyTextBlock">
              <h2 className="fs_54">A Culture Built on Craft & Collaboration</h2>
              <p>
                At ZAR, craftsmanship is driven by collaboration. Designers, artisans, and technicians work together seamlessly, ensuring every piece reflects precision, consistency, and attention to detail.
              </p>
              <p>
                We foster a culture where ideas are valued and skill is continuously refined. From concept to final finishing, each stage is guided by teamwork, discipline, and a shared commitment to quality.
              </p>
              <p>
                We believe in enabling growth through learning and real opportunities, so our people don’t just create jewellery, but build meaningful and lasting careers.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Our Values Section */}
      <section className="valuesSection mt-100">
        <div className="container">
          <h2 className="fs_54 txt_center">WHY WORK WITH ZAR</h2>
          <p className="valuesSectionSubtitle">An environment where craftsmanship meets precision, and careers are built with purpose.</p>
          <div className="valuesGrid">
            <div className="valueCard">
              <div className="valueIcon">
                <svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="129" height="129" rx="64.5" stroke="#D0B480" />
                  <g clipPath="url(#clip0_1_1376)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M81.8695 80.0189C81.8689 80.5095 81.6737 80.9798 81.3267 81.3267C80.9798 81.6736 80.5094 81.8687 80.0187 81.8691H49.9815C49.4908 81.8689 49.0202 81.6739 48.6732 81.327C48.3262 80.9801 48.1311 80.5096 48.1307 80.0189V49.981C48.1311 49.4903 48.3262 49.0199 48.6733 48.673C49.0203 48.3261 49.4908 48.1311 49.9815 48.1309H80.0187C80.5094 48.1313 80.9797 48.3264 81.3267 48.6732C81.6737 49.0201 81.8689 49.4904 81.8695 49.981V80.0189ZM93.5957 52.9822C93.9687 52.9822 94.3264 52.834 94.5901 52.5703C94.8538 52.3066 95.002 51.9489 95.002 51.5759C95.002 51.203 94.8538 50.8453 94.5901 50.5816C94.3264 50.3178 93.9687 50.1697 93.5957 50.1697H84.6815V49.9811C84.6801 48.7449 84.1884 47.5597 83.3143 46.6856C82.4402 45.8115 81.255 45.3198 80.0187 45.3184H79.8303V36.4062C79.8303 36.0333 79.6822 35.6756 79.4184 35.4119C79.1547 35.1482 78.797 35 78.4241 35C78.0511 35 77.6934 35.1482 77.4297 35.4119C77.166 35.6756 77.0178 36.0333 77.0178 36.4062V45.3184H66.4062V36.4062C66.4062 36.0333 66.2581 35.6756 65.9944 35.4119C65.7306 35.1482 65.373 35 65 35C64.627 35 64.2694 35.1482 64.0056 35.4119C63.7419 35.6756 63.5938 36.0333 63.5938 36.4062V45.3184H52.9824V36.4062C52.9824 36.0333 52.8343 35.6756 52.5705 35.4119C52.3068 35.1482 51.9491 35 51.5762 35C51.2032 35 50.8455 35.1482 50.5818 35.4119C50.3181 35.6756 50.1699 36.0333 50.1699 36.4062V45.3184H49.9815C48.7452 45.3196 47.5599 45.8113 46.6856 46.6854C45.8114 47.5595 45.3196 48.7447 45.3181 49.981V50.1696H36.4062C36.0333 50.1696 35.6756 50.3177 35.4119 50.5815C35.1482 50.8452 35 51.2029 35 51.5758C35 51.9488 35.1482 52.3065 35.4119 52.5702C35.6756 52.8339 36.0333 52.9821 36.4062 52.9821H45.3181V63.5938H36.4062C36.0333 63.5938 35.6756 63.7419 35.4119 64.0056C35.1482 64.2694 35 64.627 35 65C35 65.373 35.1482 65.7306 35.4119 65.9944C35.6756 66.2581 36.0333 66.4062 36.4062 66.4062H45.3181V77.0175H36.4062C36.0333 77.0175 35.6756 77.1656 35.4119 77.4293C35.1482 77.6931 35 78.0508 35 78.4237C35 78.7967 35.1482 79.1544 35.4119 79.4181C35.6756 79.6818 36.0333 79.83 36.4062 79.83H45.3181V80.0184C45.3196 81.2547 45.8113 82.44 46.6856 83.3141C47.5599 84.1883 48.7452 84.6799 49.9815 84.6812H50.1699V93.5938C50.1699 93.9667 50.3181 94.3244 50.5818 94.5881C50.8455 94.8518 51.2032 95 51.5762 95C51.9491 95 52.3068 94.8518 52.5705 94.5881C52.8343 94.3244 52.9824 93.9667 52.9824 93.5938V84.6816H63.5938V93.5938C63.5938 93.9667 63.7419 94.3244 64.0056 94.5881C64.2694 94.8518 64.627 95 65 95C65.373 95 65.7306 94.8518 65.9944 94.5881C66.2581 94.3244 66.4062 93.9667 66.4062 93.5938V84.6816H77.0176V93.5938C77.0176 93.9667 77.1657 94.3244 77.4295 94.5881C77.6932 94.8518 78.0509 95 78.4238 95C78.7968 95 79.1545 94.8518 79.4182 94.5881C79.6819 94.3244 79.8301 93.9667 79.8301 93.5938V84.6816H80.0185C81.2547 84.6802 82.4399 84.1885 83.3141 83.3144C84.1882 82.4403 84.6799 81.2551 84.6813 80.0189V79.8304H93.5955C93.9685 79.8304 94.3262 79.6823 94.5899 79.4185C94.8536 79.1548 95.0018 78.7971 95.0018 78.4242C95.0018 78.0512 94.8536 77.6935 94.5899 77.4298C94.3262 77.1661 93.9685 77.0179 93.5955 77.0179H84.6815V66.4062H93.5957C93.9687 66.4062 94.3264 66.2581 94.5901 65.9944C94.8538 65.7306 95.002 65.373 95.002 65C95.002 64.627 94.8538 64.2694 94.5901 64.0056C94.3264 63.7419 93.9687 63.5938 93.5957 63.5938H84.6815V52.9822H93.5957ZM75.7227 52.8711H54.2773C53.9044 52.8711 53.5467 53.0193 53.283 53.283C53.0193 53.5467 52.8711 53.9044 52.8711 54.2773V75.7232C52.8711 76.0962 53.0193 76.4539 53.283 76.7176C53.5467 76.9813 53.9044 77.1295 54.2773 77.1295H75.7227C76.0956 77.1295 76.4533 76.9813 76.717 76.7176C76.9808 76.4539 77.1289 76.0962 77.1289 75.7232V54.2779C77.1291 54.0932 77.0928 53.9102 77.0222 53.7395C76.9516 53.5688 76.848 53.4136 76.7174 53.283C76.5868 53.1523 76.4317 53.0487 76.2611 52.978C76.0904 52.9073 75.9074 52.871 75.7227 52.8711Z" fill="#D0B480" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_1376">
                      <rect width="60" height="60" fill="white" transform="translate(35 35)" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h4>Legacy and Stability</h4>
              <p>Built on decades of expertise in gold jewellery manufacturing and trusted industry partnerships.</p>
            </div>
            <div className="valueCard">
              <div className="valueIcon">
                <svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="129" height="129" rx="64.5" stroke="#D0B480" />
                  <path d="M98.8325 64.2725H96.1001V65.7278H98.8325C99.2343 65.7278 99.5601 65.402 99.5601 65.0001C99.5601 64.5983 99.2343 64.2725 98.8325 64.2725Z" fill="#D0B480" />
                  <path d="M69.3813 39.0095V50.9377C72.8693 51.1136 76.1232 52.5559 78.6108 55.0435C81.098 57.5306 82.5402 60.7846 82.7162 64.2725H94.6448H96.1001V61.4785C96.1001 61.0766 95.7738 60.7508 95.3724 60.7508H90.6794C90.1092 57.7889 88.9266 54.9355 87.2315 52.4317L90.5511 49.1116C90.6875 48.9752 90.7644 48.7903 90.7644 48.5972C90.7644 48.4046 90.6875 48.2192 90.5511 48.0829L85.571 43.1032C85.2866 42.8188 84.8262 42.8188 84.5418 43.1032L81.2222 46.4228C78.7179 44.7277 75.8649 43.5446 72.903 42.9749V38.2823C72.903 37.8805 72.5768 37.5547 72.1754 37.5547H69.3809V38.2823V39.0095H69.3813Z" fill="#D0B480" />
                  <path d="M82.7162 65.728C82.5402 69.2159 81.098 72.4699 78.6108 74.957C76.1232 77.4446 72.8693 78.8869 69.3813 79.0628V90.991V91.7186V92.4463H72.1758C72.5772 92.4463 72.9035 92.1205 72.9035 91.7186V87.0256C75.8654 86.4559 78.7184 85.2728 81.2226 83.5777L84.5423 86.8978C84.6786 87.0341 84.8636 87.1106 85.0571 87.1106C85.2497 87.1106 85.4351 87.0341 85.5714 86.8978L90.5516 81.9172C90.836 81.6332 90.836 81.1724 90.5516 80.8885L87.2319 77.5684C88.9271 75.0646 90.1097 72.2111 90.6798 69.2492H95.3729C95.7743 69.2492 96.1005 68.9234 96.1005 68.5216V65.7275H94.6452H82.7162V65.728Z" fill="#D0B480" />
                  <path d="M69.3813 52.3955V57.292C73.0709 57.6371 76.017 60.5828 76.3622 64.2728H81.2586C80.8946 57.8887 75.7655 52.76 69.3813 52.3955Z" fill="#D0B480" />
                  <path d="M69.3813 72.7084V77.6048C75.7655 77.2408 80.8946 72.1117 81.2586 65.7275H76.3622C76.017 69.4175 73.0713 72.3632 69.3813 72.7084Z" fill="#D0B480" />
                  <path d="M69.3813 58.7549V64.2728H74.8992C74.5649 61.3865 72.2681 59.0892 69.3813 58.7549Z" fill="#D0B480" />
                  <path d="M74.8992 65.728H69.3813V71.2459C72.2681 70.9116 74.5649 68.6143 74.8992 65.728Z" fill="#D0B480" />
                  <path d="M67.9263 92.4458V95.1786C67.9263 95.58 68.2525 95.9063 68.6539 95.9063C69.0558 95.9063 69.3816 95.58 69.3816 95.1786V92.4458H68.6539H67.9263Z" fill="#D0B480" />
                  <path d="M69.3811 37.5547V34.8219C69.3811 34.4205 69.0553 34.0942 68.6534 34.0942C68.252 34.0942 67.9258 34.4205 67.9258 34.8219V37.5547H68.6534H69.3811Z" fill="#D0B480" />
                  <path d="M67.9263 79.0627C64.4383 78.8867 61.1848 77.4445 58.6972 74.9569C56.2101 72.4697 54.7678 69.2158 54.5919 65.7278H42.6633H41.208V68.5219C41.208 68.9237 41.5342 69.2495 41.9356 69.2495H46.6287C47.1988 72.2114 48.3814 75.0649 50.0766 77.5687L46.7569 80.8888C46.4725 81.1727 46.4725 81.6335 46.7569 81.9175L51.7371 86.8981C51.8734 87.0344 52.0584 87.1109 52.2514 87.1109C52.4445 87.1109 52.6299 87.0344 52.7662 86.8981L56.0859 83.578C58.5901 85.2731 61.4431 86.4562 64.405 87.0259V90.9913H36.0163V39.0095H64.4046V42.9749C61.4427 43.5446 58.5897 44.7277 56.0854 46.4228L52.7658 43.1032C52.4814 42.8188 52.021 42.8188 51.7366 43.1032L46.7569 48.0833C46.6206 48.2197 46.5436 48.4046 46.5436 48.5977C46.5436 48.7903 46.6206 48.9757 46.7569 49.112L50.0766 52.4321C48.3814 54.9359 47.1988 57.7894 46.6287 60.7513H41.9356C41.5342 60.7513 41.208 61.0771 41.208 61.4789V64.273H42.6633H54.5919C54.7678 60.785 56.2101 57.5311 58.6972 55.0439C61.1848 52.5563 64.4383 51.1141 67.9263 50.9381V39.0095V37.5547H65.1322H35.2887H31.1676C30.7657 37.5547 30.4399 37.8805 30.4399 38.2823C30.4399 38.6842 30.7657 39.01 31.1676 39.01H34.5615V90.9908H31.1676C30.7657 90.9908 30.4399 91.3166 30.4399 91.7185C30.4399 92.1203 30.7657 92.4461 31.1676 92.4461H35.2887H65.1322H67.9263V90.9908V79.0627Z" fill="#D0B480" />
                  <path d="M60.9458 65.728H56.0493C56.4134 72.1122 61.5425 77.2408 67.9262 77.6053V72.7089C64.2362 72.3633 61.2909 69.4176 60.9458 65.728Z" fill="#D0B480" />
                  <path d="M67.9261 71.2459V65.728H62.4087C62.743 68.6143 65.0398 70.9116 67.9261 71.2459Z" fill="#D0B480" />
                  <path d="M62.4087 64.2728H67.9261V58.7549C65.0398 59.0892 62.743 61.3865 62.4087 64.2728Z" fill="#D0B480" />
                  <path d="M56.0493 64.2728H60.9458C61.2909 60.5833 64.2362 57.6371 67.9262 57.292V52.3955C61.5425 52.76 56.4134 57.8887 56.0493 64.2728Z" fill="#D0B480" />
                  <path d="M37.748 65.0001C37.748 65.402 38.0738 65.7278 38.4757 65.7278H41.2081V64.2725H38.4757C38.0738 64.2725 37.748 64.5983 37.748 65.0001Z" fill="#D0B480" />
                </svg>
              </div>
              <h4>Creative Environment</h4>
              <p>Work alongside designers, artisans, and innovators in a space shaped by collaboration and detail.</p>
            </div>
            <div className="valueCard">
              <div className="valueIcon">
                <svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="129" height="129" rx="64.5" stroke="#D0B480" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M55.7751 40.9412L36.8532 46.0112C36.754 46.0378 36.7104 46.1257 36.7432 46.2221C37.3801 48.0859 38.0409 48.8903 38.7596 49.1368C39.3865 49.3518 40.2224 49.1912 41.1685 48.9479C41.4168 48.3457 41.7229 47.7843 42.1013 47.2537C42.4505 46.7629 43.1315 46.6481 43.6223 46.9973C44.113 47.3465 44.2279 48.0275 43.8787 48.5182C43.3276 49.2909 42.9679 50.1904 42.7962 51.122L40.9746 60.9985C40.957 61.0942 41.0205 61.1829 41.1184 61.1923C41.659 61.244 42.2152 61.2615 42.599 61.1246C42.7806 61.06 42.9212 60.9203 42.9721 60.6514L43.6318 52.97C43.7805 51.237 44.5727 49.7675 45.939 48.691L55.7751 40.9412ZM57.2349 76.6534C57.2349 76.0493 57.7246 75.5596 58.3287 75.5596C58.9327 75.5596 59.4224 76.0493 59.4224 76.6534V80.2035C59.4224 80.8076 58.9327 81.2973 58.3287 81.2973C57.7246 81.2973 57.2349 80.8076 57.2349 80.2035V76.6534ZM47.6952 77.6759C47.3932 77.1545 47.5712 76.4868 48.0926 76.1848C48.614 75.8828 49.2816 76.0607 49.5837 76.5821L51.3587 79.6567C51.6607 80.1781 51.4827 80.8457 50.9613 81.1478C50.4399 81.4498 49.7723 81.2718 49.4702 80.7504L47.6952 77.6759ZM67.0738 76.5864C67.3735 76.0649 68.0391 75.8851 68.5607 76.1848C69.0821 76.4845 69.262 77.1501 68.9623 77.6717L67.1873 80.7462C66.8876 81.2676 66.222 81.4474 65.7004 81.1478C65.179 80.8481 64.9991 80.1824 65.2988 79.6609L67.0738 76.5864ZM61.0056 87.7345L58.3287 84.8329L55.6518 87.7345H61.0056ZM53.5009 86.8464L52.3932 84.2337H55.911L53.5009 86.8464ZM60.7465 84.2339H64.2643L63.1566 86.8465L60.7465 84.2339ZM47.9049 87.7345H51.5105L50.394 85.101L47.9049 87.7345ZM65.1468 87.7345H68.7526L66.2634 85.1009L65.1468 87.7345ZM68.9962 89.922H64.2899L61.0818 99.7046L68.9962 89.922ZM61.9921 89.922L58.3287 101.093L54.6654 89.922H61.9921ZM52.3676 89.922H47.6613L55.5757 99.7046L52.3676 89.922ZM82.526 29.9145L85.9823 28.9884C87.249 28.649 88.5588 29.4053 88.8982 30.6718L93.1866 46.6767C93.526 47.9432 92.7698 49.2532 91.5031 49.5926L88.0468 50.5187C86.7801 50.8581 85.4702 50.1018 85.1309 48.8353L80.8426 32.8304C80.5032 31.5639 81.2595 30.2539 82.526 29.9145ZM51.8077 49.2206L48.3496 55.2103C47.5179 56.649 47.3076 58.2393 47.7376 59.8443L49.0729 64.8281C48.9113 65.2345 48.6415 65.5648 48.2955 65.8196C47.7916 66.191 47.1215 66.4204 46.3701 66.5092C45.462 66.6167 44.7168 65.8901 44.7949 64.9795L45.8109 53.1492C45.908 52.0178 46.3973 51.1109 47.2891 50.4082L60.6191 39.9054C60.9682 39.6304 61.3151 39.4565 61.7443 39.3415L79.0777 34.697L82.1685 46.2318L81.6776 46.3523C80.2734 46.6968 79.2049 47.729 78.9174 49.1603L77.124 58.0885C76.8041 59.6803 75.8912 60.8999 74.4532 61.6537L64.1545 67.0539C63.8677 67.1831 63.296 67.5837 62.9893 67.3429C62.6768 67.0974 62.4382 66.4787 62.2288 65.697C61.712 63.7678 63.4398 62.5478 64.8982 61.7056L68.3029 59.7139C69.7174 58.8864 70.5051 57.3964 70.3843 55.7609L70.2373 53.7721C70.0721 51.5343 67.9195 49.9662 65.7163 50.5565L60.2449 52.0226C58.9845 52.3603 57.9818 53.127 57.3198 54.2507L55.2379 57.7848C54.7365 58.636 54.6051 59.5848 54.8609 60.5395L56.7096 67.439C57.0504 68.7109 57.0188 69.5789 56.6941 70.1835C56.3731 70.7815 55.7107 71.2165 54.804 71.5928C54.0026 71.9253 53.1195 71.4906 52.8949 70.6521L49.8479 59.2803C49.5646 58.2229 49.6891 57.2518 50.2377 56.3039L53.6959 50.3142C53.9979 49.7928 53.8199 49.1251 53.2985 48.8231C52.7774 48.5212 52.1098 48.699 51.8077 49.2206Z" fill="#D0B480" />
                </svg>
              </div>
              <h4>Growth Opportunities</h4>
              <p> Continuous learning, skill development, and clear pathways for long-term career growth.</p>
            </div>
            <div className="valueCard">
              <div className="valueIcon">
                <svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="129" height="129" rx="64.5" stroke="#D0B480" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M65.8037 38.5585C71.8611 41.3243 78.2511 44.184 85.0708 43.7727L87.1227 43.6489V66.1041C87.1227 78.8237 77.8557 89.8242 65.3322 92.0074L64.9998 92.0653L64.6674 92.0074C52.1439 89.8242 42.877 78.8237 42.877 66.1041V43.6489L44.9289 43.7727C51.7486 44.184 58.1385 41.3241 64.1959 38.5584L64.9998 38.1914L65.8037 38.5585ZM63.1086 68.1254L57.4457 62.4625C56.4276 61.4443 54.7763 61.4443 53.7582 62.4625C52.74 63.4808 52.74 65.1318 53.7582 66.1501L61.2694 73.6613C62.2877 74.6796 63.9387 74.6796 64.957 73.6613C69.4836 69.1347 73.9588 64.5571 78.4646 60.0098C79.4751 58.9899 79.4728 57.3448 78.454 56.3318C77.4359 55.3193 75.7865 55.321 74.7753 56.3423L63.1086 68.1254ZM64.9998 40.319C58.4814 43.2954 52.0041 46.1384 44.8123 45.7046V66.1041C44.8123 77.92 53.4384 88.0851 64.9998 90.1007C76.5613 88.0852 85.1874 77.9202 85.1874 66.1041V45.7046C77.9956 46.1383 71.5183 43.2954 64.9998 40.319ZM42.8252 40.5999C42.0946 40.4671 41.4125 40.647 40.8425 41.1228C40.2726 41.5987 39.9736 42.2376 39.9736 42.98V66.104C39.9736 80.7471 50.8987 92.9601 64.9998 95C79.101 92.9602 90.0261 80.7472 90.0261 66.1041V42.9801C90.0261 42.2377 89.7271 41.5987 89.1572 41.1229C88.5872 40.6471 87.905 40.4674 87.1744 40.6C79.7225 41.9529 73.2797 38.7638 64.9998 35C56.7201 38.7638 50.2772 41.9529 42.8252 40.5999Z" fill="#D0B480" />
                </svg>
              </div>
              <h4>Modern Infrastructure</h4>
              <p>Advanced tools, efficient systems, and structured processes that support quality and precision.</p>
            </div>
          </div>
        </div>
      </section>
      <CareerSlider />

      {/* Current Openings Section */}
      {positions.length > 0 && (
        <section ref={openingsRef} className={`mt-100 ${styles.openingsSection}`}>
          <div className="container">
            <h2 className="fs_54 txt_center" style={{ marginBottom: '12px' }}>CURRENT OPENINGS</h2>
            <p className='txt_center'>
              Explore opportunities across teams and find a role aligned with your skills, experience, and growth.
            </p>
            <div className={styles.openingsGrid}>
              {positions.map((position, index) => (
                <div key={position.id || position.title} className={styles.openingCard}>
                  {/* Part 1: Counter + Title */}
                  <div className={styles.openingPart1}>
                    <span className={styles.positionNumber}>{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="fs_30">{position.title}</h3>
                  </div>
                  {/* Part 2: Experience | Location | Description */}
                  <div className={styles.openingPart2}>
                    <div className={styles.openingMeta}>
                      <span className={styles.metaLabel}>Experience:</span>
                      <span className={styles.metaValue}>{position.experience}</span>
                    </div>
                    <div className={styles.openingMeta}>
                      <span className={styles.metaLabel}>Location:</span>
                      <span className={styles.metaValue}>{position.location}</span>
                    </div>
                    <div className={styles.openingDesc}>
                      <p>{position.description}</p>
                    </div>
                  </div>
                  {/* Part 3: Button */}
                  <div className={styles.positionAction}>
                    <Button
                      variant="secondary"
                      showArrow
                      onClick={() => handleApplyNow(position.title)}
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* cta section */}
      <section className={`mt-100 ${styles.ctaSection}`}>
        <div className={styles.ctaImageWrapper}>
          <Image
            src="/images/career/career-bg.webp"
            alt="ZAR careers"
            fill
            style={{ objectFit: 'cover' }}
            sizes="100vw"
          />
        </div>
        <div className={`container ${styles.ctaContainer}`}>
          <h2 className={styles.ctaTitle}>Let’s Build Something Together</h2>
          <p className={styles.ctaDescription}>
            If you don’t see a suitable role, share your profile with us we’ll reach out when an opportunity aligns with your expertise.
          </p>
          <Button href="mailto:info@zarjewels.com" variant="secondary" showArrow>
            Email Your Resume
          </Button>
        </div>
      </section>
      {/* form section */}
      <section ref={formRef} className='mt-100 mb-100'>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.formSection}>
              <h2 className="formHeading">Start Your Application</h2>
              <form className="form" onSubmit={onCareerSubmit} noValidate>
                <div className="formRow">
                  <InputField
                    id="fullName"
                    label="Full Name"
                    placeholder="Type full name here"
                    wrapperClassName={styles.inputGroup}
                    required
                    errorMessage={errors.fullName?.message}
                    {...register('fullName', {
                      required: 'Full name is required.',
                      pattern: { value: NAME_REGEX, message: 'Enter a valid full name.' },
                      minLength: { value: 2, message: 'Full name must be at least 2 characters.' },
                      maxLength: { value: 80, message: 'Full name cannot exceed 80 characters.' },
                    })}
                  />
                  <InputField
                    id="companyName"
                    label="Company Name"
                    placeholder="Type your company name here"
                    wrapperClassName={styles.inputGroup}
                    errorMessage={errors.companyName?.message}
                    {...register('companyName', {
                      validate: (value) =>
                        !value || COMPANY_REGEX.test(value) || 'Enter a valid company name.',
                      maxLength: { value: 100, message: 'Company name cannot exceed 100 characters.' },
                    })}
                  />
                </div>
                <div className="formRow">
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: 'Please select a role.' }}
                    render={({ field }) => (
                      <SelectField
                        id="role"
                        label="Role"
                        placeholder="Select your role"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        options={[
                          { label: 'General Application', value: 'General' },
                          ...positions.map((pos) => ({ label: pos.title, value: pos.title }))
                        ]}
                        wrapperClassName={styles.inputGroup}
                        required
                        errorMessage={errors.role?.message}
                      />
                    )}
                  />
                  <InputField
                    id="workExperience"
                    label="Work Experience"
                    placeholder="e.g. 3 years"
                    wrapperClassName={styles.inputGroup}
                    required
                    errorMessage={errors.workExperience?.message}
                    {...register('workExperience', {
                      required: 'Work experience is required.',
                      pattern: { value: WORK_REGEX, message: 'Enter a valid work experience (e.g. 3 years).' },
                      maxLength: { value: 30, message: 'Work experience cannot exceed 30 characters.' },
                    })}
                  />
                </div>
                <div className="formRow">
                  <InputField
                    id="email"
                    type="email"
                    label="Email ID"
                    placeholder="Enter your email ID"
                    wrapperClassName={styles.inputGroup}
                    required
                    errorMessage={errors.email?.message}
                    {...register('email', {
                      required: 'Email is required.',
                      pattern: { value: EMAIL_REGEX, message: 'Enter a valid email address.' },
                    })}
                  />
                  <Controller
                    name="contactNumber"
                    control={control}
                    rules={{
                      required: 'Contact number is required.',
                      validate: (value) => {
                        const digits = value.replace(/\D/g, '');
                        return (
                          (digits.length >= 7 && digits.length <= 15) ||
                          'Enter a valid contact number.'
                        );
                      },
                    }}
                    render={({ field }) => (
                      <PhoneField
                        id="contactNumber"
                        name={field.name}
                        label="Contact No."
                        placeholder="Enter your contact number"
                        wrapperClassName={styles.inputGroup}
                        required
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        errorMessage={errors.contactNumber?.message}
                      />
                    )}
                  />
                </div>
                <div className="formRow">
                  <Controller
                    name="resume"
                    control={control}
                    rules={{
                      required: 'Please attach your resume.',
                      validate: {
                        acceptedFormats: (files) => {
                          if (!files?.[0]) return true;
                          const allowed = [
                            'application/pdf',
                            'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                          ];
                          return allowed.includes(files[0].type) || 'Only PDF, DOC, DOCX files are accepted.';
                        },
                        fileSize: (files) => {
                          if (!files?.[0]) return true;
                          return files[0].size <= 5 * 1024 * 1024 || 'File size must not exceed 5 MB.';
                        },
                      },
                    }}
                    defaultValue={undefined}
                    render={({ field }) => (
                      <div
                        className={`inputfile${isDragging ? ' inputfile--dragging' : ''}`}
                        role="button"
                        tabIndex={0}
                        aria-label="Resume upload drop zone"
                        onClick={() => document.getElementById('uploadResume')?.click()}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            document.getElementById('uploadResume')?.click();
                          }
                        }}
                        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => handleDrop(e, field.onChange)}
                      >
                        <input
                          type="file"
                          id="uploadResume"
                          name={field.name}
                          accept=".pdf,.doc,.docx"
                          ref={field.ref}
                          value={undefined}
                          onBlur={field.onBlur}
                          onChange={(event) => {
                            field.onChange(event.target.files);
                            const files = event.target.files;
                            if (files?.[0]) {
                              setResumeFileName(files[0].name);
                            } else {
                              setResumeFileName('');
                            }
                          }}
                          style={{ display: 'none' }}
                        />
                        <div className="custom-file-upload">
                          <p>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#666666" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M17 8L12 3L7 8" stroke="#666666" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M12 3V15" stroke="#666666" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {isDragging ? 'Drop your file here' : 'Attach Your Resume In PDF, Word Format'}
                          </p>
                          <p><small>Max Size: 5 Mb</small></p>
                        </div>
                        {errors.resume && (
                          <p style={{ color: '#c00', fontSize: '12px', marginTop: '4px', textAlign: 'center' }}>{errors.resume.message}</p>
                        )}
                        {resumeFileName && (
                          <p style={{ marginTop: '12px', fontSize: '14px', color: '#111', textAlign: 'center', paddingBottom: '12px' }}>
                            <strong>Selected file:</strong> {resumeFileName}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <CustomCaptcha key={captchaRefreshKey} onStatusChange={handleCaptchaStatusChange} />

                <Button variant="primary" showArrow type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
                {/* Submit Toast feedback is handled globally */}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
