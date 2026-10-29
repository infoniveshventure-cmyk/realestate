import { connectDB } from '@/lib/db/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// Lightweight comment collection / in-memory store for demo mode
const mockComments: Record<string, any[]> = {
  'luxury-real-estate-market-surges-2026': [
    {
      _id: 'comm-1',
      authorName: 'Rajesh Mehta',
      content: 'Very insightful analysis on NCR and Mumbai micro-market yields.',
      createdAt: new Date().toISOString(),
      status: 'Approved',
    },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const comments = mockComments[slug] || [];
    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { authorName, content } = body;

    if (!authorName || !content) {
      return NextResponse.json(
        { success: false, error: 'Name and comment are required' },
        { status: 400 }
      );
    }

    const newComment = {
      _id: 'comm-' + Date.now(),
      authorName: String(authorName).trim().slice(0, 100),
      content: String(content).trim().slice(0, 1000),
      createdAt: new Date().toISOString(),
      status: 'Approved',
    };

    if (!mockComments[slug]) {
      mockComments[slug] = [];
    }
    mockComments[slug].unshift(newComment);

    return NextResponse.json({ success: true, data: newComment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit comment' }, { status: 500 });
  }
}
