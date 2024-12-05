import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  await dbConnect();

  try {
    const users = await User.aggregate([
      {
        $project: {
          firstname: 1,
          lastname: 1,
          totalAmount: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$redeem',
                    as: 'item',
                    cond: { $eq: ['$$item.paymentstatus', 'complete'] }
                  }
                },
                as: 'filteredredeem',
                in: '$$filteredredeem.amount'
              }
            }
          }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    return NextResponse.json(
      { ok: 'Fetch successful', data: users },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
};
