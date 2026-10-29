import { NextRequest, NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/auth/admin';

export async function POST(request: NextRequest) {
  try {
    await clearAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
