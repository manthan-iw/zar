export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  purity: string;
}

export interface Style {
  id: string;
  name: string;
  slug: string;
  image: string;
  purity: string;
  categorySlug: string;
}

export interface ProductCard {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: string;
  purity: string;
  style: string;
}

export interface TechnicalSpec {
  feature: string;
  details: string;
}

export interface ManufacturingPoint {
  label: string;
  text: string;
}

export interface ProductDetail extends ProductCard {
  sku: string;
  images: string[];
  model3d?: string;
  variants?: string[];
  weight?: string;
  finish?: string;
  specifications?: Record<string, string>;
  technicalSpecs?: TechnicalSpec[];
  manufacturing?: {
    heading: string;
    subtitle: string;
    points: ManufacturingPoint[];
  };
}

export interface CareerPosition {
  id: string;
  title: string;
  slug: string;
  location: string;
  experience: string;
  description: string;
  isActive: boolean;
}

export interface ContactFormPayload {
  name: string;
  company?: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface CareerApplyPayload {
  name: string;
  company?: string;
  role: string;
  workExperience: string;
  email: string;
  phone: string;
  resumeUrl?: string;
}
