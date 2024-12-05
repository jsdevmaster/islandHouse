'use client';

import { AdminRegisterUsers, UserRegister } from '@/constants/data';
import { columns } from './columns';
import { useState, useEffect } from 'react';
import BanTablePage from './ban-table';
import { useSearchParams } from 'next/navigation';


export default function BanTable() {
  const [data, setData] = useState<AdminRegisterUsers[] & UserRegister[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParam, setSearchParam] = useState('');
  const [selectCategory, setSelectCategory] = useState('tag');

  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');
  
  const page = Number(pageParam? pageParam : 1);
  const limit = Number(limitParam? limitParam : 10);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const UserResponse = await fetch('/api/admin/getbannedlist');
        const UserResult = await UserResponse.json();
        const sortedData = UserResult.data.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.error('Invalid date:', a.createdAt, b.createdAt);
            return 0; 
          }
          
          return dateB.getTime() - dateA.getTime();
        });

        setData(sortedData);
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
        return item.tag?.toString().includes(param);
      case 'firstname':
        return item.firstname?.toLowerCase().includes(param);
      case 'email':
        return item.email?.toLowerCase().includes(param);
      case 'ip':
        return item.ip?.toLowerCase().includes(param);
      // case 'phonenumber':
      //   return item.register?.phonenumber?.toLowerCase().includes(param);
      default:
        return true;
    }
  });

  const offset = (page - 1) * limit;
  const paginatedData = filteredData.slice(offset, offset + limit);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="space-y-4 ">
      <div className="flex justify-end">
        <select
          onChange={(e) => setSelectCategory(e.target.value)}
          className="mt-3 h-9 rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
        >
          <option value="tag">Tag Number</option>
          <option value="firstname">Name</option>
          <option value="email">Username</option>
          <option value="ip">IP Address</option>
          <option value="phonenumber">Phone Number</option>
        </select>
        <input
          className="mt-3 h-9 rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
          placeholder="Search..."
          onChange={(e) => setSearchParam(e.target.value)}
        />
      </div>
      <BanTablePage
        columns={columns}
        data={paginatedData}
        totalItems={filteredData.length}
      />
    </div>
  );
}
