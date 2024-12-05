'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AdminRegisterUsers,
  Paymentredeems,
  PaymentWithdrawals,
  UserRegister
} from '@/constants/data';
import useSocket from '@/lib/socket';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect } from 'react';

export function UserNav() {
  const { socket } = useSocket();
  const userInfoStr = localStorage.getItem('userinfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      localStorage.setItem('userinfo', JSON.stringify(session.userInfo));
    }
  }, []);

  const signOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };
  const ok = () => {};

  useEffect(() => {
    async function fetchData() {
      try {
        const registerResponse = await fetch('/api/admin/getregister');
        const registerResult = await registerResponse.json();

        const usersResponse = await fetch('/api/admin/getregister');
        const usersResult = await usersResponse.json();

        const combinedData = registerResult.data.flatMap((registerEntry: any) =>
          registerEntry.register.map((register: UserRegister) => {
            const user = usersResult.data.find(
              (user: AdminRegisterUsers) => user._id === register.id
            );
            return { ...register, user };
          })
        );
        const preparingItemsCount = combinedData.filter(
          (item: any) => item.status === 'preparing'
        ).length;
        socket?.emit('registerRequest', preparingItemsCount);
      } catch (error) {
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const registerResponse = await fetch('/api/admin/getuserverify'); // Your API for redeems
        const registerResult = await registerResponse.json();

        const usersResponse = await fetch('/api/admin/getuserverify'); // Your API for users
        const usersResult = await usersResponse.json();

        const combinedData = registerResult.data.flatMap(
          (completeRegsiterEntry: any) =>
            completeRegsiterEntry.completeRegisters.map(
              (register: UserRegister) => {
                const user = usersResult.data.find(
                  (user: AdminRegisterUsers) => user._id === register.id
                );
                return { ...register, user };
              }
            )
        );

        const processingItemsCount = combinedData.filter(
          (item: any) => item.status === 'Processing'
        ).length;
        socket?.emit('verifyRequest', processingItemsCount);
      } catch (error) {
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
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

        socket?.emit('depositRequest', combinedData.length);
      } catch (error) {
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const withdrawalsResponse = await fetch('/api/admin/getuser'); // Your API for withdrawals
        const withdrawalsResult = await withdrawalsResponse.json();

        const usersResponse = await fetch('/api/admin/getuser'); // Corrected API for users
        const usersResult = await usersResponse.json();

        const filteredWithdrawals = withdrawalsResult.data.flatMap(
          (withdrawalEntry: any) =>
            withdrawalEntry.withdrawal.filter(
              (withdrawal: PaymentWithdrawals) =>
                withdrawal.paymentstatus === 'Processing'
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
        socket?.emit('withdrawalRequest', combinedData.length);
      } catch (error) {
      }
    }
    fetchData();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" handleClick={ok}>
          <Image src="/log-out.png" width={25} height={25} alt="log-out" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userInfo.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userInfo.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  // }
}
