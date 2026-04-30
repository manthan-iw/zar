import type { CareerPosition } from '@/types/domain';

export const CAREER_POSITIONS: CareerPosition[] = [
  {
    id: 'hr-executive',
    slug: 'hr-executive',
    title: 'HR Executive',
    location: 'Mumbai',
    experience: '2-4 Years',
    description:
      'Join our team to build people systems and hiring pipelines that support craftsmanship excellence.',
    isActive: true,
  },
  {
    id: 'qa-manager',
    slug: 'quality-assurance-manager',
    title: 'Quality Assurance Manager',
    location: 'Mumbai',
    experience: '1-4 Years',
    description:
      'Lead quality assurance processes and ensure every Zar product meets premium finishing standards.',
    isActive: true,
  },
  {
    id: 'product-designer',
    slug: 'product-designer',
    title: 'Product Designer',
    location: 'Mumbai',
    experience: '2-5 Years',
    description:
      'Design gold bangle collections balancing traditional identity with contemporary retail demand.',
    isActive: true,
  },
  {
    id: 'sales-retail-partnerships',
    slug: 'sales-executive-retail-partnerships',
    title: 'Sales Executive - Retail Partnerships',
    location: 'Pan India',
    experience: '2-4 Years',
    description:
      'Expand and manage relationships with retail partners across India with consultative selling.',
    isActive: true,
  },
];
