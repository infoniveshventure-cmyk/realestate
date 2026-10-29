import { connectDB } from '@/lib/db/mongodb';
import Project from '@/lib/db/models/Project';
import { MOCK_PROJECTS } from '@/lib/db/mockData';
import { isAdminAuthenticated } from '@/lib/auth/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const isAuth = await isAdminAuthenticated();
    const db = await connectDB();

    if (!db) {
      const mockProj = MOCK_PROJECTS.find((p) => p.slug === slug || p._id === slug);
      if (mockProj) {
        if (!mockProj.published && !isAuth) {
          return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: mockProj });
      }
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const query: any = { slug };
    if (!isAuth) {
      query.published = true;
    }

    const project = await Project.findOne(query).lean();

    if (!project) {
      const mockProj = MOCK_PROJECTS.find((p) => p.slug === slug || p._id === slug);
      if (mockProj) {
        if (!mockProj.published && !isAuth) {
          return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: mockProj });
      }
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Project detail GET error:', error);
    const mockProj = MOCK_PROJECTS.find((p) => p.slug === slug || p._id === slug);
    if (mockProj) {
      return NextResponse.json({ success: true, data: mockProj });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
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

    const project = await Project.findOneAndUpdate({ slug }, body, { new: true });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error('Project PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const db = await connectDB();

    if (!db) {
      return NextResponse.json({ success: true, message: 'Project deleted in demo mode' });
    }

    const project = await Project.findOneAndDelete({ slug });

    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    console.error('Project DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
