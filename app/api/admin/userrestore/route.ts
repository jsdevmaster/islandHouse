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

  const { id, action } = requestData;

  // Ensure required fields are present
  if (!id || !action) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.action = action;

    // Save the user document
    const updatedUser = await user.save();

    return NextResponse.json(
      {
        ok: 'BannedList added successfully',
        user: updatedUser // Include the updated user if needed
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
