import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  await dbConnect();

  const id = request.headers.get('Authorization')?.split(' ')[1];
  const date = request.headers.get('Authorization-Date')?.split(' ')[1];

  if (!id || !date) {
    return NextResponse.json(
      { error: 'Authorization token and date are required' },
      { status: 401 }
    );
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const foundRegister = user.redeem.find((item: any) => (item.date = date));

    if (!foundRegister) {
      return NextResponse.json(
        { error: 'No registration found for the specified date' },
        { status: 403 }
      );
    }

    return NextResponse.json(foundRegister, { status: 200 });
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    } else if (err.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Token expired' }, { status: 402 });
    }

    return NextResponse.json(
      { error: 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
};
