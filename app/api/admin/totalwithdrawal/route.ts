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
                    input: '$withdrawal',
                    as: 'withdrawalItem',
                    cond: {
                      $eq: ['$$withdrawalItem.paymentstatus', 'complete']
                    }
                  }
                },
                as: 'filteredWithdrawal',
                in: '$$filteredWithdrawal.amount'
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
