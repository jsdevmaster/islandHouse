import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { token, category, phonenumber, status, id } = await request.json();
  await dbConnect();

  try {
    // Find the user by the token
    const user = await User.findOne({ token: token });

    if (user) {
      // Add new redeem information to the existing redeems array
      user.register.push({
        category: category,
        phonenumber: phonenumber,
        status: status,
        id: id
      });

      try {
        // Save the updated user document
        await user.save();

        return NextResponse.json(
          {
            ok: 'redeem added successfully'
          },
          { status: 200 }
        ); // Return success with a 200 status
      } catch (err: any) {
        return NextResponse.json(
          { error: 'Failed to save updated user' },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 }); // Return not found
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
