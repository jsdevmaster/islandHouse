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

  const { paymentstatus, data } = requestData;

  if (!paymentstatus || !Array.isArray(data)) {
    return NextResponse.json(
      { error: 'Missing required fields or data is not an array' },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const results = [];

    for (const item of data) {
      const { id, date } = item;

      if (!id || !date) {
        return NextResponse.json(
          { error: 'Missing id or date in data' },
          { status: 400 }
        );
      }

      const user = await User.findById(id);
      if (!user) {
        results.push({ id, status: 'User not found' });
        continue;
      }

      const redeemIndex = user.redeem.findIndex((dep: any) => {
        const depDate = new Date(dep.date).getTime();
        const requestDate = new Date(date).getTime();
        return depDate === requestDate;
      });

      if (redeemIndex === -1) {
        results.push({ id, status: 'No redeem found with the given date' });
        continue;
      }

      user.redeem[redeemIndex].paymentstatus = paymentstatus;

      user.redeem[redeemIndex].comdate = new Date();

      await user.save();

      results.push({ id, status: 'Redeem updated successfully' });
    }

    return NextResponse.json(
      {
        results
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
