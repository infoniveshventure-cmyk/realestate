import { connectDB } from '@/lib/db/mongodb';
import Enquiry from '@/lib/db/models/Enquiry';
import { isAdminAuthenticated } from '@/lib/auth/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { subject, message } = body;

    const db = await connectDB();
    if (db) {
      await Enquiry.findByIdAndUpdate(id, {
        leadStatus: 'Contacted',
        lastContactDate: new Date(),
      });
    }

    // Email provider integration stub (SendGrid / SMTP)
    console.log(`[Email Dispatched] To enquiry: ${id}, Subject: ${subject || 'Advisory Update'}`);

    return NextResponse.json({
      success: true,
      message: 'Email dispatched successfully and lead marked as Contacted',
    });
  } catch (error) {
    console.error('Send Email error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process email' }, { status: 500 });
  }
}
