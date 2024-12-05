import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { token, paymentgateway } = await request.json();
  await dbConnect();

  try {
    const user = await User.findOne({ token });

    if (user) {
      const existingEntryIndex = user.withdrawal.findIndex(
        (entry: any) => entry.paymentgateway === 'none'
      );

      if (existingEntryIndex !== -1) {
        user.withdrawal[existingEntryIndex].paymentgateway = paymentgateway;
      } else {
        user.withdrawal.push({
          paymentgateway: paymentgateway
        });
      }

      try {
        await user.save();

        return NextResponse.json(
          {
            ok: 'Withdrawal processed successfully'
          },
          { status: 200 }
        );
      } catch (err: any) {
        return NextResponse.json(
          { error: 'Failed to save updated user' },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
