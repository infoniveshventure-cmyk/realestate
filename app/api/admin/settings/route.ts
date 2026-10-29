import { connectDB } from '@/lib/db/mongodb';
import Settings from '@/lib/db/models/Settings';
import { isAdminAuthenticated } from '@/lib/auth/admin';
import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_SETTINGS = {
  siteName: 'Nivesh Ventures',
  tagline: 'Together We Grow',
  about: 'Pioneering high-trust architectural acquisitions and landmark real estate advisory.',
  email: 'info@niveshventures.com',
  phone: '+91 98765 43210',
  whatsappNumber: '+919876543210',
  address: 'Level 14, Two Horizon Center, DLF Phase 5, Gurugram, Haryana 122002',
  socialLinks: {
    facebook: 'https://facebook.com/niveshventures',
    instagram: 'https://instagram.com/niveshventures',
    linkedin: 'https://linkedin.com/company/niveshventures',
    twitter: 'https://twitter.com/niveshventures',
    youtube: 'https://youtube.com/@niveshventures',
  },
  privacyPolicy: 'Standard Privacy Policy for Nivesh Ventures.',
  termsConditions: 'Standard Terms & Conditions for Nivesh Ventures.',
};

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ success: true, data: DEFAULT_SETTINGS });
    }

    let settings = await Settings.findOne().lean();
    if (!settings) {
      settings = await Settings.create(DEFAULT_SETTINGS);
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ success: true, data: DEFAULT_SETTINGS });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const db = await connectDB();

    if (!db) {
      return NextResponse.json({
        success: true,
        data: { ...DEFAULT_SETTINGS, ...body },
        message: 'Settings saved in demo mode',
      });
    }

    const settings = await Settings.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
