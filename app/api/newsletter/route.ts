import { connectDB } from '@/lib/db/mongodb';
import { NextRequest, NextResponse } from 'next/server';

let mockSubscribers: { email: string; createdAt: string }[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    const normalized = email.toLowerCase().trim();
    if (!mockSubscribers.some((s) => s.email === normalized)) {
      mockSubscribers.push({ email: normalized, createdAt: new Date().toISOString() });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to Nivesh Ventures Market Intelligence!',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Subscription failed' }, { status: 500 });
  }
}
