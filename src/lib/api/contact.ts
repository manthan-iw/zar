import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://testintelliworkz.tech/Zar_backend';

export type ContactInquiryPayload = {
  fullName: string;
  companyName?: string;
  email: string;
  contactNumber: string;
  inquiryType: string;
  message: string;
};

type ContactInquiryResponse = {
  success: boolean;
  message: string;
};

export async function submitContactInquiry(payload: ContactInquiryPayload): Promise<ContactInquiryResponse> {
  const response = await axios.post<ContactInquiryResponse>(
    `${API_BASE_URL}/api/contact-inquiry`,
    payload,
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    }
  );
  return response.data;
}
