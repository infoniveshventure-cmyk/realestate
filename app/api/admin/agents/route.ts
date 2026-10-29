import { connectDB } from '@/lib/db/mongodb';
import { isAdminAuthenticated } from '@/lib/auth/admin';
import { NextRequest, NextResponse } from 'next/server';

let mockAgents = [
  {
    _id: 'agent-1',
    name: 'Aarav Singhania',
    email: 'aarav@niveshventures.com',
    phone: '+91 98200 11223',
    role: 'Senior Portfolio Advisor',
    activeLeads: 8,
    convertedLeads: 14,
    status: 'Active',
  },
  {
    _id: 'agent-2',
    name: 'Meera Kapoor',
    email: 'meera@niveshventures.com',
    phone: '+91 98300 44556',
    role: 'Luxury Acquisition Specialist',
    activeLeads: 5,
    convertedLeads: 9,
    status: 'Active',
  },
];

export async function GET() {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: true, data: mockAgents });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch agents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, role } = body;
    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    const newAgent = {
      _id: 'agent-' + Date.now(),
      name,
      email,
      phone: phone || '',
      role: role || 'Portfolio Advisor',
      activeLeads: 0,
      convertedLeads: 0,
      status: 'Active',
    };

    mockAgents.push(newAgent);
    return NextResponse.json({ success: true, data: newAgent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create agent' }, { status: 500 });
  }
}
