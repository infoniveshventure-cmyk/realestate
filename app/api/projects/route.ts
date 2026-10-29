import { connectDB } from '@/lib/db/mongodb';
import Project from '@/lib/db/models/Project';
import { MOCK_PROJECTS } from '@/lib/db/mockData';
import { isAdminAuthenticated } from '@/lib/auth/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const propertyType = searchParams.get('propertyType');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null;
    const sort = searchParams.get('sort') || 'newest';
    const all = searchParams.get('all') === 'true'; // Admin bypass to see drafts

    if (!db) {
      // Mock data mode with full filtering, sorting, and pagination
      let filtered = [...MOCK_PROJECTS];
      if (!all) {
        filtered = filtered.filter((p) => p.published);
      }
      if (propertyType) {
        filtered = filtered.filter((p) => p.propertyType.toLowerCase() === propertyType.toLowerCase());
      }
      if (status) {
        filtered = filtered.filter((p) => p.status.toLowerCase() === status.toLowerCase());
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.location.toLowerCase().includes(s) ||
            (p.slug && p.slug.toLowerCase().includes(s))
        );
      }
      if (minPrice !== null) {
        filtered = filtered.filter((p) => (p.price || p.priceRange?.min || 0) >= minPrice);
      }
      if (maxPrice !== null) {
        filtered = filtered.filter((p) => (p.price || p.priceRange?.max || Infinity) <= maxPrice);
      }

      // Sorting
      if (sort === 'price-low') {
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (sort === 'price-high') {
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
      } else {
        // default newest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const total = filtered.length;
      const paginated = filtered.slice((page - 1) * limit, page * limit);

      return NextResponse.json({
        success: true,
        data: paginated,
        pagination: {
          total,
          pages: Math.ceil(total / limit) || 1,
          currentPage: page,
          limit,
        },
      });
    }

    const filter: any = {};
    if (!all) {
      filter.published = true;
    }

    if (propertyType) filter.propertyType = new RegExp(`^${propertyType}$`, 'i');
    if (status) filter.status = new RegExp(`^${status}$`, 'i');
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice !== null || maxPrice !== null) {
      filter.price = {};
      if (minPrice !== null) filter.price.$gte = minPrice;
      if (maxPrice !== null) filter.price.$lte = maxPrice;
    }

    let sortQuery: any = { createdAt: -1 };
    if (sort === 'price-low') {
      sortQuery = { price: 1 };
    } else if (sort === 'price-high') {
      sortQuery = { price: -1 };
    }

    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        total,
        pages: Math.ceil(total / limit) || 1,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Projects GET error, falling back to mock data:', error);
    return NextResponse.json({
      success: true,
      data: MOCK_PROJECTS.slice(0, 3),
      pagination: { total: MOCK_PROJECTS.length, pages: 1, currentPage: 1, limit: 3 },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Project name is required' }, { status: 400 });
    }

    // Auto-generate slug if not provided
    if (!body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const db = await connectDB();
    if (!db) {
      const newMock = {
        _id: 'mock-proj-' + Date.now(),
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return NextResponse.json({ success: true, data: newMock }, { status: 201 });
    }

    const project = new Project(body);
    await project.save();

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error('Projects POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}
