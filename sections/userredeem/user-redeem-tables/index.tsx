'use client';
import { columns } from './columns';
import { useState, useEffect } from 'react';
import { Paymentredeems, UserRegister } from '@/constants/data';
import UserredeemTableView from './user-redeem-table';
import { useSearchParams } from 'next/navigation';

const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

export default function UserredeemTable() {
  const [data, setData] = useState<Paymentredeems[]>([]);
  const [totalData, setTotalData] = useState<number>(0); // Store total items for pagination
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>('');

  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');
  
  const page = Number(pageParam? pageParam : 1);
  const limit = Number(limitParam? limitParam : 10);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!userInfo.token) {
          throw new Error('User not authenticated.');
        }

        setLoading(true);

        const response = await fetch('/api/customer/getuserInfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        const sortedData = result.data[0].redeem.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);

          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.error('Invalid date:', a.createdAt, b.createdAt);
            return 0;
          }
        });

        setData(sortedData);
        setCategory(result.data[0].register[0].status);
        setTotalData(result.totalCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userInfo]);

  const offset = (page - 1) * limit;
  const paginatedData = data.slice(offset, offset + limit);

  if (category !== 'complete') {
    return (
      <div className="text-center text-xl font-bold text-red-500">
        First at all, You must register!
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 ">
      <UserredeemTableView
        columns={columns}
        data={paginatedData}
        totalItems={data.length}
      />
    </div>
  );
}
