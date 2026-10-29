import { connectDB } from '@/lib/db/mongodb';
import News from '@/lib/db/models/News';
import { MOCK_NEWS } from '@/lib/db/mockData';
import { isAdminAuthenticated } from '@/lib/auth/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await connectDB();

    if (!db) {
      const mockArticle = MOCK_NEWS.find((n) => n.slug === slug || n._id === slug);
      if (mockArticle) {
        return NextResponse.json({ success: true, data: mockArticle });
      }
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    const article = await News.findOne({ slug }).lean();
    if (!article) {
      const mockArticle = MOCK_NEWS.find((n) => n.slug === slug || n._id === slug);
      if (mockArticle) {
        return NextResponse.json({ success: true, data: mockArticle });
      }
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('News detail GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();
    const db = await connectDB();

    if (!db) {
      return NextResponse.json({ success: true, data: { ...body, slug } });
    }

    const article = await News.findOneAndUpdate({ slug }, body, { new: true });
    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('News PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const db = await connectDB();

    if (!db) {
      return NextResponse.json({ success: true, message: 'Article deleted in demo mode' });
    }

    const article = await News.findOneAndDelete({ slug });
    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    console.error('News DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 });
  }
}
