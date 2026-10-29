import { connectDB } from '@/lib/db/mongodb';
import Project from '@/lib/db/models/Project';
import Enquiry from '@/lib/db/models/Enquiry';
import News from '@/lib/db/models/News';
import { MOCK_PROJECTS, MOCK_NEWS } from '@/lib/db/mockData';
import { isAdminRequest } from '@/lib/auth/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const isAuth = await isAdminRequest(request);
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();

    if (!db) {
      return NextResponse.json({
        success: true,
        data: {
          totalProjects: MOCK_PROJECTS.length,
          publishedProjects: MOCK_PROJECTS.filter((p) => p.published).length,
          totalEnquiries: 12,
          newEnquiriesLast7Days: 4,
          totalArticles: MOCK_NEWS.length,
          conversionRate: '16.8%',
          recentEnquiries: [
            {
              fullName: 'Vikramaditya Sharma',
              mobileNumber: '+91 98765 43210',
              propertyType: 'Residential',
              leadStatus: 'New',
              createdAt: new Date().toISOString(),
            },
            {
              fullName: 'Pooja Singhania',
              mobileNumber: '+91 98111 22334',
              propertyType: 'Commercial',
              leadStatus: 'Contacted',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
          ],
        },
      });
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalProjects,
      publishedProjects,
      totalEnquiries,
      newEnquiriesLast7Days,
      totalArticles,
      recentEnquiries,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ published: true }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      News.countDocuments(),
      Enquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProjects,
        publishedProjects,
        totalEnquiries,
        newEnquiriesLast7Days,
        totalArticles,
        conversionRate: totalEnquiries > 0 ? `${((3 / totalEnquiries) * 100).toFixed(1)}%` : '0%',
        recentEnquiries,
      },
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
