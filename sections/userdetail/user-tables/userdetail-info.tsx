'use client';

import { AdminRegisterUsers } from '@/constants/data';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface UserData {
  tag: string;
}

export default function UserdetailInfo() {
  const [data, setData] = useState<AdminRegisterUsers[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const [tag, setTag] = useState('');

  const id = searchParams.get('id');

  const userData = {
    id: id,
    tag: tag
  };

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);

        const response = await fetch('/api/admin/getuserInfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${id}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        if (result.data && result.data.length > 0) {
          setData(result.data || []);
          setTotalData(result.totalCount || 0);
        } else {
          console.error('No data found in the result:', result);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const onTagNumber = async (userData: UserData) => {
    try {
      const response = await fetch('/api/customer/tagnumber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Tag number failed' };
      }

      location.reload();

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const handleKeyDown = async (event: any) => {
    if (event.key === 'Enter') {
      const response = await onTagNumber(userData);
      if (response && response.error) {
        toast({
          title: 'Tag Number Updating Failed',
          description: 'Tag number can already exist. Please try again.'
        });
      } else {
        toast({
          title: 'Tag Number Updating Successful',
          description: 'Welcome! Your tag number has been updated.'
        });
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="mt-5 p-4">
        <input
          className="mt-3 border-none text-center text-xl font-bold outline-none"
          defaultValue={data[0].tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="mt-10 flex">
          <p className="text-md w-[150px] font-semibold">Name</p>
          <p className="text-start">
            {data[0].firstname} {data[0].lastname}
          </p>
        </div>
        <div className="mt-5 flex">
          <p className="text-md w-[150px] font-semibold">UserName</p>
          <p className="w-[170px] break-words text-start sm:w-[300px] lg:w-[200px]">
            {data[0].email}
          </p>
        </div>
        <div className="mt-5 flex">
          <p className="text-md w-[150px] font-semibold">Phone Number</p>
          <p className="text-start">
            {data[0].register &&
            data[0].register.length > 0 &&
            data[0].register[0].phonenumber
              ? data[0].register[0].phonenumber
              : 'None'}
          </p>
        </div>
        <div className="mt-5 flex">
          <p className="text-md w-[150px] font-semibold">IP Address</p>
          <p className="text-start">{data[0].ip}</p>
        </div>
      </div>
    </>
  );
}
