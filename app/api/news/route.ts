import { connectDB } from '@/lib/db/mongodb';
import News from '@/lib/db/models/News';
import { MOCK_NEWS } from '@/lib/db/mockData';
import { isAdminAuthenticated } from '@/lib/auth/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();

    if (!db) {
      return NextResponse.json({
        success: true,
        data: MOCK_NEWS,
      });
    }

    const news = await News.find({ published: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error('News GET error, using mock fallback:', error);
    return NextResponse.json({ success: true, data: MOCK_NEWS });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const db = await connectDB();

    if (!db) {
      const newMock = {
        _id: 'mock-news-' + Date.now(),
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json({ success: true, data: newMock }, { status: 201 });
    }

    const news = new News(body);
    await news.save();

    return NextResponse.json({ success: true, data: news }, { status: 201 });
  } catch (error) {
    console.error('News POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create news' }, { status: 500 });
  }
}
