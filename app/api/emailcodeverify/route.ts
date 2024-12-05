import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { email, code, verifystatus } = await request.json();

  // Connect to the database
  await dbConnect();

  try {
    // Find the user by email
    const user = await User.findOne({ email: email });

    // Check if the user exists
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Compare the provided code with the code in the database
    if (user.emailcode === code) {
      // If codes match, update the user record to indicate verification is successful (optional)
      user.isVerified = true;
      user.verifystatus = verifystatus;
      await user.save();

      return NextResponse.json(
        { message: 'Email verified successfully' },
        { status: 200 }
      );
    } else {
      // If codes do not match, return an error
      return NextResponse.json(
        { error: 'Verification code does not match' },
        { status: 400 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An error occurred while verifying the code' },
      { status: 500 }
    );
  }
};
