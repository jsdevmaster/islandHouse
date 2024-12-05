import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { token, date, codenumber, status } = await request.json();

  if (!date || !codenumber || !status || !token) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const existingUser = await User.findOne({ token: token });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        token: token,
        'register.date': date,
        'register.codenumber': codenumber
      },
      {
        $set: {
          'register.$.status': status
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Phone number not found in register' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { ok: 'User updated', user: updatedUser },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'An error occurred while updating user.' },
      { status: 500 }
    );
  }
};
