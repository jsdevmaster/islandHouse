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

  const { paymentstatus, data } = requestData;

  // Ensure required fields are present
  if (!paymentstatus || !Array.isArray(data)) {
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

      // Log the withdrawals for debugging
      const withdrawalIndex = user.withdrawal.findIndex((dep: any) => {
        const depDate = new Date(dep.date).getTime();
        const requestDate = new Date(date).getTime();
        return depDate === requestDate;
      });

      if (withdrawalIndex === -1) {
        results.push({ id, status: 'No withdrawal found with the given date' });
        continue; // Move on to the next item
      }

      // Update the payment status of the found withdrawal entry
      user.withdrawal[withdrawalIndex].paymentstatus = paymentstatus;

      // Add the current date and time to the 'comdate' field
      user.withdrawal[withdrawalIndex].comdate = new Date(); // Captures the current date and time

      // Save the user document
      await user.save();

      results.push({ id, status: 'Withdrawal updated successfully' });
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
