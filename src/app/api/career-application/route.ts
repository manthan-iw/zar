import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

type CareerApplicationPayload = {
  fullName?: string;
  companyName?: string;
  role?: string;
  workExperience?: string;
  email?: string;
  contactNumber?: string;
  cvFile?: string;
};

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CareerApplicationPayload;

    const fullName = body.fullName?.trim() || '';
    const role = body.role?.trim() || '';
    const workExperience = body.workExperience?.trim() || '';
    const email = body.email?.trim() || '';
    const contactNumber = body.contactNumber?.trim() || '';

    if (!fullName || !role || !workExperience || !email || !contactNumber) {
      return NextResponse.json(
        { success: false, error: 'Please fill all required fields.' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Career application received.' },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request payload.' },
      { status: 400 }
    );
  }
}
