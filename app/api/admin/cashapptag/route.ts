import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { token, cashtag } = await request.json();

  if (!token || !cashtag) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const user = await User.findOneAndUpdate(
      { token },
      { cashtag },
      { new: true }
    );

    if (user) {
      return NextResponse.json({ ok: 'User updated', user }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
