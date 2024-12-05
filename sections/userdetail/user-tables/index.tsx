'use client';

import { AdminRegisterUsers, UserRegister } from '@/constants/data';
import { columns } from './columns';
import { useState, useEffect } from 'react';
import UserdetailTablePage from './userdetail-table';
import UserdetailInfo from './userdetail-info';
import { useSearchParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';

export default function UserdetailTable() {
  const [data, setData] = useState<AdminRegisterUsers[] & UserRegister[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();

  const id = searchParams.get('id');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const UserResponse = await fetch('/api/admin/getregister');
        const UserResult = await UserResponse.json();

        const usersResponse = await fetch('/api/admin/getregister');
        const usersResult = await usersResponse.json();

        const combinedData = UserResult.data.flatMap((registerEntry: any) =>
          registerEntry.register.map((register: UserRegister) => {
            const user = usersResult.data.find(
              (user: AdminRegisterUsers) => user._id === register.id
            );
            return { ...register, user };
          })
        );

        const filteredUserData = combinedData.filter(
          (item: any) => item.user && item.user._id === id
        );

        setData(filteredUserData);
        setTotalData(UserResult.totalCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lg:flex">
      <div className="w-full lg:w-[400px]">
        <UserdetailInfo />
      </div>
      <div className="ml-2 mt-5 w-full lg:mt-0">
        <UserdetailTablePage
          columns={columns as ColumnDef<UserRegister, unknown>[]}
          data={data}
          totalItems={data.length}
        />
      </div>
    </div>
  );
}
