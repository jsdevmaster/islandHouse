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

  const { data } = requestData;

  // Ensure required fields are present
  if (!Array.isArray(data)) {
    return NextResponse.json(
      { error: 'Missing required fields or data is not an array' },
      { status: 400 }
    );
  }

  // Connect to the database
  await dbConnect();

  try {
    // Initialize a response array for results
    const results = [];

    // Iterate over the data array
    for (const item of data) {
      const { id, date } = item;

      // Ensure id and date are present
      if (!id || !date) {
        return NextResponse.json(
          { error: 'Missing id or date in data' },
          { status: 400 }
        );
      }

      // Find the user by ID
      const user = await User.findById(id);
      if (!user) {
        results.push({ id, status: 'User not found' });
        continue; // Move on to the next item
      }

      // Log the registers for debugging
      const registerIndex = user.register.findIndex((dep: any) => {
        const depDate = new Date(dep.date).getTime();
        const requestDate = new Date(date).getTime();
        return depDate === requestDate;
      });

      if (registerIndex === -1) {
        results.push({ id, status: 'No register found with the given date' });
        continue; // Move on to the next item
      }

      // Delete the found register entry
      user.register.splice(registerIndex, 1);

      // Save the user document
      await user.save();

      results.push({ id, status: 'Register updated successfully' });
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
