'use client';
import { columns } from './columns';
import { useState, useEffect } from 'react';
import { AdminRegisterUsers, PaymentWithdrawals } from '@/constants/data';
import UserPromotionTableView from './user-promtion-table';
import PromotionPage from './promotion-fron';

const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

export default function UserPromotionTable() {
  const [data, setData] = useState<(PaymentWithdrawals & AdminRegisterUsers)[]>(
    []
  );
  const [totalData, setTotalData] = useState<number>(0); // Store total items for pagination
  const [loading, setLoading] = useState<boolean>(true);
  const [tag, setTag] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        if (!userInfo.token) {
          throw new Error('User not authenticated.');
        }

        setLoading(true);

        const withdrawalsResponse = await fetch('/api/customer/getuserInfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}` // Assuming the token is sent this way
          }
        });

        if (!withdrawalsResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const withdrawalsResult = await withdrawalsResponse.json();

        const usersResponse = await fetch('/api/customer/getuserInfo', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}` // Assuming the token is sent this way
          }
        });

        if (!usersResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const usersResult = await usersResponse.json();

        const filteredWithdrawals = withdrawalsResult.data.flatMap(
          (withdrawalEntry: any) =>
            withdrawalEntry.withdrawal.filter(
              (withdrawal: PaymentWithdrawals) =>
                withdrawal.paymentstatus === 'complete'
            )
        );

        const combinedData = filteredWithdrawals.map(
          (withdrawal: PaymentWithdrawals) => {
            const user = usersResult.data.find(
              (user: AdminRegisterUsers) => user._id === withdrawal.id
            );
            return { ...withdrawal, user };
          }
        );

        setTag(usersResult.data[0].tag);
        setData(combinedData);
        setTotalData(filteredWithdrawals.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const latestData = data
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4 ">
      <PromotionPage tag={tag} />
      <p className="flex justify-center font-bold">Player Redeem List</p>
      <UserPromotionTableView
        columns={columns}
        data={latestData}
        totalItems={totalData}
      />
    </div>
  );
}
