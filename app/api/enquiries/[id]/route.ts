import { connectDB } from '@/lib/db/mongodb';
import Enquiry from '@/lib/db/models/Enquiry';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth/admin';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const enquiry = await Enquiry.findById(id).lean();

    if (!enquiry) {
      return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: enquiry });
  } catch (error) {
    console.error('Enquiry detail GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch enquiry' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid enquiry ID' }, { status: 400 });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(id, body, { new: true });

    if (!enquiry) {
      return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: enquiry });
  } catch (error) {
    console.error('Enquiry PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update enquiry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const db = await connectDB();

    if (!db) {
      return NextResponse.json({ success: true, message: 'Enquiry deleted in demo mode' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'Invalid enquiry ID' }, { status: 400 });
    }

    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Enquiry DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete enquiry' }, { status: 500 });
  }
}
