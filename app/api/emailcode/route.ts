import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { email, code } = await request.json();

  // Connect to the database
  await dbConnect();

  try {
    // Find the user by email and update the emailcode field with the new code
    const user = await User.findOneAndUpdate(
      { email },
      { emailcode: code },
      { new: true } // Return the updated document
    );

    // Check if the user exists
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Send a success response
    return NextResponse.json(
      { message: 'Code updated successfully', user },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An error occurred while updating the code' },
      { status: 500 }
    );
  }
};
