import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { date, loginid, id, passwordcode, status } = await request.json();

  if (!date || !loginid || !passwordcode || !status || !id) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id, 'register.date': date },
      {
        $set: {
          'register.$.loginid': loginid,
          'register.$.passwordcode': passwordcode,
          'register.$.status': status
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found with the specified date in register' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { ok: 'User updated', user: updatedUser },
      { status: 200 }
    );
  } catch (err: any) {
    // Handle errors during DB operations
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
