import { NextResponse } from 'next/server';
import { CAREER_POSITIONS } from '@/lib/data/careers';

type CareerPayload = {
  name?: string;
  company?: string;
  role?: string;
  workExperience?: string;
  email?: string;
  phone?: string;
  resumeUrl?: string;
};

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export async function GET() {
  return NextResponse.json({
    success: true,
    data: CAREER_POSITIONS.filter((position) => position.isActive),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CareerPayload;

    const name = body.name?.trim() || '';
    const role = body.role?.trim() || '';
    const workExperience = body.workExperience?.trim() || '';
    const email = body.email?.trim() || '';
    const phone = body.phone?.trim() || '';

    if (!name || !role || !workExperience || !email || !phone) {
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
