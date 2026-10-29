import { connectDB } from '@/lib/db/mongodb';
import Project from '@/lib/db/models/Project';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await connectDB();

    if (!db) {
      return NextResponse.json({ success: true, message: 'View recorded (demo mode)' });
    }

    await Project.updateOne({ slug }, { $inc: { views: 1 } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to record view' }, { status: 500 });
  }
}
