import type { CareerPosition } from '@/types/domain';
import type { ApiResponse } from './client';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://testintelliworkz.tech/Zar_backend';


type CareerApplyResult = {
  message: string;
  id?: number;
};

export type CareerApplicationPayload = {
  fullName: string;
  companyName?: string;
  role: string;
  workExperience: string;
  email: string;
  contactNumber: string;
  cvFile?: string;
};

export async function fetchCareerPositions(): Promise<CareerPosition[]> {
  const response = await fetch(`${API_BASE_URL}/api/careers/`);
  const payload = await response.json();

  if (!response.ok || !payload.success || !Array.isArray(payload.items)) {
    throw new Error(payload.error || 'Failed to fetch career positions');
  }

  return payload.items.map((item: {
    id: number | string;
    position: string;
    experience: string;
    location: string;
    jobDescription: string;
  }) => ({
    id: item.id,
    title: item.position,
    slug: item.position
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, ''),
    location: item.location,
    experience: item.experience,
    description: item.jobDescription,
    isActive: true,
  }));
}

export async function submitCareerApplication(
  payload: CareerApplicationPayload | FormData
): Promise<CareerApplyResult> {
  const init: RequestInit = {};
  let body: BodyInit;

  if (payload instanceof FormData) {
    body = payload;
  } else {
    body = JSON.stringify(payload);
    init.headers = {
      'Content-Type': 'application/json',
    };
  }

  const response = await fetch(`${API_BASE_URL}/api/career-application`, {
    method: 'POST',
    ...init,
    body,
  });

  const payloadResponse = (await response.json()) as ApiResponse<CareerApplyResult> & {
    message?: string;
    id?: number;
  };

  if (!response.ok) {
    throw new Error(payloadResponse.error || payloadResponse.message || 'API request failed');
  }

  if (!payloadResponse.success) {
    throw new Error(payloadResponse.error || payloadResponse.message || 'API request failed');
  }

  if (payloadResponse.data !== undefined) {
    return payloadResponse.data;
  }

  if (payloadResponse.message !== undefined) {
    return {
      message: payloadResponse.message,
      id: payloadResponse.id,
    };
  }

  throw new Error('API request failed');
}
