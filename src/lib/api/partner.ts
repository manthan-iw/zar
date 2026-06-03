import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://testintelliworkz.tech/Zar_backend';

export type BuildConnectionPayload = {
  fullName: string;
  companyName: string;
  email: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  contact: string;
  category: string;
  referredBy: string;
  companyWebsite: string;
  message: string;
};

type BuildConnectionResponse = {
  success: boolean;
  message: string;
};

export async function submitBuildConnection(
  payload: BuildConnectionPayload
): Promise<BuildConnectionResponse> {
  const response = await axios.post<BuildConnectionResponse>(
    `${API_BASE_URL}/api/build-connections`,
    payload,
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    }
  );

  return response.data;
}