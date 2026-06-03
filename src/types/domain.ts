export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  purity: string;
  imageUrl?: string;
  goldTypeId?: number;
  goldTypeName?: string;
}

export interface Style {
  id: string;
  name: string;
  slug: string;
  image: string;
  purity: string;
  categorySlug: string;
  imageUrl?: string;
  goldTypeId?: number;
  goldTypeName?: string;
  categoryId?: number;
  categoryName?: string;
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
  images?: string[];
  sku?: string;
  categoryId?: number;
  categoryName?: string;
  goldTypeId?: number;
  goldTypeName?: string;
  collectionTypeId?: number;
  collectionTypeName?: string;
  numberOfPcs?: number;
  finish?: string;
  productUrl?: string;
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
  pcs?: string;
  weight?: string;
  finish?: string;
  specifications?: Record<string, string>;
  technicalSpecs?: TechnicalSpec[];
  manufacturing?: {
    heading: string;
    subtitle: string;
    points: ManufacturingPoint[];
  };
  manufacturingHtml?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CareerPosition {
  id: number | string;
  title: string;
  slug?: string;
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

export interface CareerApplicationPayload {
  fullName: string;
  companyName?: string;
  role: string;
  workExperience: string;
  email: string;
  contactNumber: string;
  cvFile?: string;
}
