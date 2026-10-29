import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/admin';

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }
    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        role: 'admin',
        email: process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@niveshventures.com',
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Auth check failed' }, { status: 500 });
  }
}
