import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  // Attempt to parse the JSON body
  let requestData;
  try {
    requestData = await request.json();
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to parse JSON' },
      { status: 400 }
    );
  }

  const { id, paymentstatus, date } = requestData;

  if (!id || !paymentstatus || !date) {
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

    user.redeem[redeemIndex].paymentstatus = paymentstatus;

    user.redeem[redeemIndex].comdate = new Date();

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
