import type { CareerPosition } from '@/types/domain';
import { apiGet, apiPost } from './client';

type CareerApplyResult = {
  message: string;
};

export type CareerApplyPayload = {
  name: string;
  company?: string;
  role: string;
  workExperience: string;
  email: string;
  phone: string;
  resumeUrl?: string;
};

export async function fetchCareerPositions(): Promise<CareerPosition[]> {
  return apiGet<CareerPosition[]>('/api/careers');
}

export async function submitCareerApplication(payload: CareerApplyPayload): Promise<CareerApplyResult> {
  return apiPost<CareerApplyResult, CareerApplyPayload>('/api/careers', payload);
}
