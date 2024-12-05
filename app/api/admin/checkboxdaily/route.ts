import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  let requestData;
  try {
    requestData = await request.json();
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to parse JSON' },
      { status: 400 }
    );
  }

  const { id, isChecked, date } = requestData;

  if (!id || !date) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const redeemIndex = user.redeem.findIndex((dep: any) => {
      const depDate = new Date(dep.date).getTime();
      const requestDate = new Date(date).getTime();
      return depDate === requestDate;
    });

    if (redeemIndex === -1) {
      return NextResponse.json(
        { error: 'No redeem found with the given date' },
        { status: 404 }
      );
    }

    user.redeem[redeemIndex].dailyChecked =
      isChecked !== undefined ? isChecked : false;

    const updatedUser = await user.save();

    return NextResponse.json(
      {
        ok: 'redeem updated successfully',
        user: updatedUser
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
};
