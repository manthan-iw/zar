export type HeroSlideOrientation = 'horizontal' | 'vertical';

export interface HeroSlideContentTiming {
  titleDelay: number;
  titleDuration: number;
  subtitleDelay: number;
  subtitleDuration: number;
  buttonDelay: number;
  buttonDuration: number;
}

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  heading: string;
  subtitle: string;
  orientation: HeroSlideOrientation;
  slice1Rotation: number;
  slice2Rotation: number;
  slice1Scale: number;
  slice2Scale: number;
  contentTiming: HeroSlideContentTiming;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'trusted-manufacturer',
    image: '/images/homepage/banner.webp',
    alt: "India's leading gold bangle manufacturer – ZAR Jewellery",
    heading: "INDIA'S TRUSTED\nGOLD BANGLE MANUFACTURER",
    subtitle:
      'Crafting lightweight, elegant gold bangles through innovation, precision, and timeless craftsmanship.',
    orientation: 'horizontal',
    slice1Rotation: -25,
    slice2Rotation: -25,
    slice1Scale: 2,
    slice2Scale: 2,
    contentTiming: {
      titleDelay: 180,
      titleDuration: 720,
      subtitleDelay: 330,
      subtitleDuration: 680,
      buttonDelay: 500,
      buttonDuration: 620,
    },
  },
  {
    id: 'precision-passion',
    image: '/images/homepage/banner-2.webp',
    alt: 'Precision gold jewellery craftsmanship – ZAR Jewellery',
    heading: 'CRAFTED WITH\nPRECISION & PASSION',
    subtitle:
      'From design to finish, every piece reflects decades of artistry and an unmatched commitment to quality.',
    orientation: 'vertical',
    slice1Rotation: 10,
    slice2Rotation: -15,
    slice1Scale: 1.5,
    slice2Scale: 1.5,
    contentTiming: {
      titleDelay: 220,
      titleDuration: 760,
      subtitleDelay: 390,
      subtitleDuration: 700,
      buttonDelay: 560,
      buttonDuration: 640,
    },
  },
  {
    id: 'timeless-elegance',
    image: '/images/homepage/banner-3.webp',
    alt: 'Timeless gold bangle collections – ZAR Jewellery',
    heading: 'TIMELESS ELEGANCE\nREDEFINED',
    subtitle:
      'Discover our signature collections that blend centuries of tradition with bold contemporary design.',
    orientation: 'horizontal',
    slice1Rotation: 3,
    slice2Rotation: 3,
    slice1Scale: 2,
    slice2Scale: 1,
    contentTiming: {
      titleDelay: 160,
      titleDuration: 700,
      subtitleDelay: 300,
      subtitleDuration: 660,
      buttonDelay: 460,
      buttonDuration: 600,
    },
  },
];
