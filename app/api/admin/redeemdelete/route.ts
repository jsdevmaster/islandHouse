import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const DELETE = async (request: NextRequest) => {
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

  const { id, date } = requestData;

  // Ensure required fields are present
  if (!id || !date) {
    return NextResponse.json(
      { error: 'Missing required fields: id or date' },
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

    // Try to find the redeem using the provided date
    const redeemIndex = user.redeem.findIndex((dep: any) => {
      const depDate = new Date(dep.date).getTime(); // Convert the redeem date to timestamp
      const requestDate = new Date(date).getTime(); // Convert the requested date to timestamp
      return depDate === requestDate;
    });

    // Check if the redeem was found
    if (redeemIndex === -1) {
      return NextResponse.json(
        { error: 'No redeem found with the given date' },
        { status: 404 }
      );
    }

    // Delete the found redeem entry
    user.redeem.splice(redeemIndex, 1);

    // Save the user document
    const updatedUser = await user.save();

    return NextResponse.json(
      {
        ok: 'redeem deleted successfully',
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
