'use client';
import { columns } from './columns';
import { useState, useEffect, useTransition } from 'react';
import { PaymentWithdrawals, AdminRegisterUsers } from '@/constants/data';
import AdminWithdrawalHistoryTableView from './withdrawal-table';
import useSocket from '@/lib/socket';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

interface SelectMultiIdData {
  id?: string;
  date?: string;
}

export default function AdminWithdrawalHistoryTable() {
  const { socket } = useSocket();
  const [data, setData] = useState<(PaymentWithdrawals & AdminRegisterUsers)[]>(
    []
  );
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParam, setSearchParam] = useState('');
  const [selectCategory, setSelectCategory] = useState('tag');
  const [multiIds, setMultiIds] = useState<SelectMultiIdData[]>([]);
  const [load, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');
  
  const page = Number(pageParam? pageParam : 1);
  const limit = Number(limitParam? limitParam : 10);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const withdrawalsResponse = await fetch('/api/admin/getuser');
        const withdrawalsResult = await withdrawalsResponse.json();

        const usersResponse = await fetch('/api/admin/getuser');
        const usersResult = await usersResponse.json();

        const combinedData = withdrawalsResult.data.flatMap(
          (withdrawalEntry: any) =>
            withdrawalEntry.withdrawal
              .filter((withdrawal: PaymentWithdrawals) =>
                ['complete', 'decline'].includes(withdrawal.paymentstatus)
              )
              .map((withdrawal: PaymentWithdrawals) => {
                const user = usersResult.data.find(
                  (user: AdminRegisterUsers) => user._id === withdrawal.id
                );
                return { ...withdrawal, user };
              })
        );

        const sortedData = combinedData.sort((a: any, b: any) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.error('Invalid date:', a.date, b.date);
            return 0; 
          }
          
          return dateB.getTime() - dateA.getTime();
        });

        setData(sortedData);
        setTotalData(withdrawalsResult.totalCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const param = searchParam.toLowerCase();
    switch (selectCategory) {
      case 'tag':
        return item.user?.tag?.toString().includes(param);
      case 'firstname':
        return item.user?.firstname?.toLowerCase().includes(param);
      case 'email':
        return item.user?.email?.toLowerCase().includes(param);
      case 'paymentoption':
        return item.paymentoption?.toLowerCase().includes(param);
      case 'paymenttype':
        return item.paymenttype?.toLowerCase().includes(param);
      default:
        return true;
    }
  });

  useEffect(() => {
    socket?.on('selectWithdrawalHistoryMultiIds', (data: any) => {
      setMultiIds(data);
    });
  }, []);

  useEffect(() => {
    const handleSelectMultiId = (data: SelectMultiIdData) => {
      if (!data.id && data.date) {
        setMultiIds((prevMultiIds) =>
          prevMultiIds.filter((item) => item.date !== data.date)
        );
      } else {
        setMultiIds((prevMultiIds) => [...prevMultiIds, data]);
      }
    };

    socket?.on('selectWithdrawalHistoryMultiId', handleSelectMultiId);

    return () => {
      socket?.off('selectWithdrawalHistoryMultiId', handleSelectMultiId);
    };
  }, []);

  const multiRestore = async () => {
    if (multiIds.length == 0) {
      toast({
        title: 'Restore Failed!',
        description: 'Please check item!'
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await userMultiCheck({
          paymentstatus: 'Processing',
          data: multiIds
        });

        if (response.error) {
          return;
        }

        toast({
          title: 'Restore Successful!',
          description: 'You have restored successful!'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Restore Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const userMultiCheck = async (userData: {
    paymentstatus: string;
    data: any;
  }) => {
    try {
      const response = await fetch('/api/admin/multiWithdrawalCheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'redeem failed' };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const multiDelete = async () => {
    if (multiIds.length == 0) {
      toast({
        title: 'Delete Failed!',
        description: 'Please check item!'
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await userDeleteMultiCheck({
          data: multiIds
        });

        if (response.error) {
          return;
        }

        toast({
          title: 'Delete Successful!',
          description: 'You have deleted successful!'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Delete Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const userDeleteMultiCheck = async (userData: { data: any }) => {
    try {
      const response = await fetch('/api/admin/multiWithdrawalDelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'redeem failed' };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const offset = (page - 1) * limit;
  const paginatedData = filteredData.slice(offset, offset + limit);

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or loading message if needed
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          handleClick={multiRestore}
          className="mr-3 mt-3"
        >
          Multi Restore
        </Button>
        <Button
          variant="outline"
          handleClick={multiDelete}
          className="mr-3 mt-3"
        >
          Multi Delete
        </Button>
        <select
          onChange={(e) => setSelectCategory(e.target.value)}
          className="mr-3 mt-3 h-9 rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
        >
          <option value="tag">Tag Number</option>
          <option value="firstname">Name</option>
          <option value="email">Username</option>
          <option value="paymentoption">Game</option>
          <option value="paymenttype">Type</option>
        </select>
        <input
          className="mt-3 h-9 rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
          placeholder="Search..."
          onChange={(e) => setSearchParam(e.target.value)}
        />
      </div>
      <AdminWithdrawalHistoryTableView
        columns={columns}
        data={paginatedData}
        totalItems={filteredData.length}
      />
    </div>
  );
}
