'use client';
import { columns } from './columns';
import { useState, useEffect, useTransition } from 'react';
import { Paymentredeems, AdminRegisterUsers } from '@/constants/data';
import AdminRedeemTableView from './redeem-table';
import { Button } from '@/components/ui/button';
import useSocket from '@/lib/socket';
import { toast } from '@/components/ui/use-toast';
import { useSearchParams } from 'next/navigation';

interface SelectMultiIdData {
  id?: string;
  date?: string; 
}

export default function AdminRedeemTable() {
  const { socket } = useSocket();
  const [data, setData] = useState<(Paymentredeems & AdminRegisterUsers)[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
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

        const redeemsResponse = await fetch('/api/admin/getuser');
        const redeemsResult = await redeemsResponse.json();

        const usersResponse = await fetch('/api/admin/getuser');
        const usersResult = await usersResponse.json();

        const combinedData = redeemsResult.data.flatMap((redeemEntry: any) =>
          redeemEntry.redeem
            .filter(
              (redeem: Paymentredeems) => redeem.paymentstatus === 'Processing'
            )
            .map((redeem: Paymentredeems) => {
              const user = usersResult.data.find(
                (user: AdminRegisterUsers) => user._id === redeem.id
              );
              return { ...redeem, user };
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
        setTotalData(redeemsResult.totalCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    socket?.on('selectMultiIds', (data: any) => {
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

    socket?.on('selectMultiId', handleSelectMultiId);

    return () => {
      socket?.off('selectMultiId', handleSelectMultiId);
    };
  }, []);

  const multiAccept = async () => {
    if (multiIds.length == 0) {
      toast({
        title: 'Accept Failed!',
        description: 'Please check item!'
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await userMultiCheck({
          paymentstatus: 'complete',
          data: multiIds
        });

        if (response.error) {
          return;
        }

        toast({
          title: 'Accept Successful!',
          description: 'You have accepted successful!'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Accept Failed!',
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
      const response = await fetch('/api/admin/multiCheck', {
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

  const multiDecline = async () => {
    if (multiIds.length == 0) {
      toast({
        title: 'Decline Failed!',
        description: 'Please check item!'
      });
      return;
    }

    startTransition(async () => {
      try {
        const response = await userDeclineMultiCheck({
          paymentstatus: 'decline',
          data: multiIds
        });

        if (response.error) {
          return;
        }

        toast({
          title: 'Decline Successful!',
          description: 'You have declined successful!'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Decline Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const userDeclineMultiCheck = async (userData: {
    paymentstatus: string;
    data: any;
  }) => {
    try {
      const response = await fetch('/api/admin/multiCheck', {
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

  const offset = (page - 1) * limit;
  const paginatedData = data.slice(offset, offset + limit);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" handleClick={multiAccept} className="mr-3">
          Multi Accept
        </Button>
        <Button variant="outline" handleClick={multiDecline}>
          Multi Decline
        </Button>
      </div>
      <AdminRedeemTableView
        columns={columns}
        data={paginatedData}
        totalItems={data.length}
      />
    </div>
  );
}
