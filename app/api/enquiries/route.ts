import { connectDB } from '@/lib/db/mongodb';
import Enquiry from '@/lib/db/models/Enquiry';
import { isAdminAuthenticated } from '@/lib/auth/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();

    if (!db) {
      // In local demo / test mode without MongoDB instance, return sample CRM leads
      return NextResponse.json({
        success: true,
        data: [
          {
            _id: 'enq-mock-1',
            fullName: 'Rajesh Singhal',
            mobileNumber: '+91 98111 22334',
            email: 'rajesh.singhal@example.com',
            projectName: 'The Grand Residency',
            propertyType: 'Residential',
            budgetRange: '₹3 Cr - ₹5 Cr',
            message: 'Looking for a 4BHK duplex facing the landscaped garden.',
            leadStatus: 'New',
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'enq-mock-2',
            fullName: 'Anita Deshmukh',
            mobileNumber: '+91 98220 55667',
            email: 'anita.d@example.com',
            projectName: 'Horizon Tech Park',
            propertyType: 'Commercial',
            budgetRange: '₹5 Cr - ₹10 Cr',
            message: 'Interested in Grade-A commercial office space.',
            leadStatus: 'Contacted',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
      });
    }

    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: enquiries });
  } catch (error) {
    console.error('Enquiries GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, mobileNumber, email, projectId, propertyType, budgetRange, message } = body;

    // Validation
    if (!fullName || !mobileNumber) {
      return NextResponse.json(
        { success: false, error: 'Name and mobile required' },
        { status: 400 }
      );
    }

    const db = await connectDB();

    if (!db) {
      // In testing/demo mode, accept the enquiry and return mock response
      return NextResponse.json(
        {
          success: true,
          data: {
            _id: 'mock-enquiry-' + Date.now(),
            fullName,
            mobileNumber,
            email,
            projectId,
            propertyType,
            budgetRange,
            message,
            leadStatus: 'New',
            createdAt: new Date().toISOString(),
          },
          message: 'Enquiry received successfully (demo mode)',
        },
        { status: 201 }
      );
    }

    const enquiry = new Enquiry({
      fullName,
      mobileNumber,
      email: email || undefined,
      projectId: projectId || undefined,
      propertyType,
      budgetRange,
      message,
      source: 'ProjectForm',
      leadStatus: 'New',
    });

    await enquiry.save();

    // TODO: Send email notification
    // TODO: Firebase push notification

    return NextResponse.json({ success: true, data: enquiry }, { status: 201 });
  } catch (error) {
    console.error('Enquiries POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create enquiry' }, { status: 500 });
  }
}
