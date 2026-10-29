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
    const { templateText } = body;

    const db = await connectDB();
    let enquiry: any = null;

    if (db) {
      enquiry = await Enquiry.findById(id);
      if (enquiry) {
        enquiry.leadStatus = 'Contacted';
        enquiry.lastContactDate = new Date();
        await enquiry.save();
      }
    }

    // Build standard WhatsApp URL for configured phone or lead's phone
    const targetPhone = enquiry?.mobileNumber || '+919876543210';
    const cleanPhone = targetPhone.replace(/\D/g, '');
    const message = encodeURIComponent(
      templateText ||
        `Hello ${enquiry?.fullName || 'Investor'}, thank you for contacting Nivesh Ventures regarding your property interest.`
    );
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;

    return NextResponse.json({
      success: true,
      whatsappUrl,
      message: 'WhatsApp notification prepared and lead updated to Contacted',
    });
  } catch (error) {
    console.error('Send WhatsApp error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process WhatsApp' }, { status: 500 });
  }
}
