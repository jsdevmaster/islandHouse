'use client';
import { columns } from './columns';
import { useState, useEffect } from 'react';
import { AdminRegisterUsers, PaymentWithdrawals } from '@/constants/data';
import AdminMainWithdrawalTableView from './main-withdrawal-table';
import { useSearchParams } from 'next/navigation';

export default function AdminMainTablePage() {
  const [data, setData] = useState<(PaymentWithdrawals & AdminRegisterUsers)[]>(
    []
  );
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [completeAmount, setTotalAmount] = useState<number>(0);

  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');
  
  const page = Number(pageParam? pageParam : 1);
  const limit = Number(limitParam? limitParam : 10);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const response = await fetch('/api/admin/totalwithdrawal');
        const result = await response.json();

        const transformedData = result.data
          .filter((item: any) => item.totalAmount !== 0)
          .map((item: any) => ({
            ...item
          }));

        setData(transformedData);
        setTotalData(result.totalCount);

        const sum = transformedData.reduce(
          (acc: any, curr: any) => acc + (curr.totalAmount || 0),
          0
        );
        setTotalAmount(sum);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const offset = (page - 1) * limit;
  const paginatedData = data.slice(offset, offset + limit);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 ">
      <h1 className="text-center text-lg font-bold">
        Player Withdrawal: {''} ${`${completeAmount}`}
      </h1>
      <AdminMainWithdrawalTableView
        columns={columns}
        data={paginatedData}
        totalItems={data.length}
      />
    </div>
  );
}
