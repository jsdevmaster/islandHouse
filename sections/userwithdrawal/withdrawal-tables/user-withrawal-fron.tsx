'use client';

import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  amount: z.any()
});

const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

type UserFormValue = z.infer<typeof formSchema>;

const COOLDOWN_KEY = 'cooldown_data';

export default function UserWithdrawalForm() {
  const router = useRouter();
  const [loading, startTransition] = useTransition();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  });

  const [game, setGame] = useState<string[]>([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState('CashApp');
  const [cooldown, setCooldown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const cooldownData = localStorage.getItem(COOLDOWN_KEY);
    if (cooldownData) {
      const { cooldown: savedCooldown, remainingTime: savedRemainingTime } =
        JSON.parse(cooldownData);
      setCooldown(savedCooldown);
      setRemainingTime(savedRemainingTime);
    }
  }, []);

  useEffect(() => {
    if (cooldown) {
      const intervalId = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setCooldown(false);
            localStorage.removeItem(COOLDOWN_KEY);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);

      localStorage.setItem(
        COOLDOWN_KEY,
        JSON.stringify({ cooldown, remainingTime })
      );

      return () => {
        clearInterval(intervalId);
      };
    } else {
      localStorage.removeItem(COOLDOWN_KEY);
    }
  }, [cooldown, remainingTime]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!userInfo.token) {
          throw new Error('User not authenticated.');
        }

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
        const registerArray = result.data[0].register;

        if (registerArray.length > 0) {
          setCategory(registerArray[0].status);
        }

        const categories = registerArray.map((item: any) => item.category);
        setGame(categories);
        setSelectedPayment(categories[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [userInfo]);

  const onSubmit = async (data: UserFormValue) => {
    startTransition(async () => {
      try {
        const response = await userWithdrawal({
          token: userInfo.token,
          id: userInfo.userId,
          amount: data.amount,
          paymentoption: selectedPayment,
          paymenttype: selectedWithdrawal
        });

        if (response.error) {
          console.error('Withdrawal error:', response.error);
          return;
        }

        router.push('/mypage/withdrawal/withdrawalmiddle');

        toast({
          title: 'Withdrawal Successful!',
          description: 'Welcome! Your withdrawal has been request.'
        });

        setCooldown(true);
        localStorage.setItem(
          COOLDOWN_KEY,
          JSON.stringify({ cooldown: true, remainingTime: 59 })
        );

        setTimeout(() => {
          setCooldown(false);
          localStorage.removeItem(COOLDOWN_KEY);
        }, 30000);
      } catch (error) {
        toast({
          title: 'Withdrawal Failed!',
          description: 'Welcome! Your withdrawal has been failed.'
        });
      }
    });
  };

  const userWithdrawal = async (userData: {
    token: string;
    paymentoption: string;
    paymenttype: string;
    amount: number;
    id: any;
  }) => {
    try {
      const response = await fetch('/api/withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Withdrawal failed' };
      }

      return await response.json();
    } catch (error) {
      console.error('Error during fetch:', error);
      throw error;
    }
  };

  const uniqueGames = Array.from(new Set(game));

  const options = uniqueGames.map((game) => (
    <option key={game} value={game}>
      {game}
    </option>
  ));

  const ok = () => {};

  return (
    <div>
      <div className="w-full rounded-xl border border-4 border-solid border-gray-300 bg-indigo-600 p-3">
        <p className="text-center font-semibold text-red-500">※Warning※</p>
        <p className="mt-2 text-center text-sm font-semibold text-white ">
          Free Player-Users can request a withdrawal if they have a spin record
          of $100 or more. And Daily Minimum and Maximum $100.
          <br /> Deposited Player - Minimum request $50. Maximum $3, 000 for
          Daily.
        </p>
      </div>
      <br />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <div>
            <div className="flex justify-center">
              <label className="mt-4 w-28 text-sm font-medium">Category</label>
              <select
                id="gameSelect"
                value={selectedPayment}
                onChange={(e) => setSelectedPayment(e.target.value)}
                className="mt-3 h-9 w-[200px] rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
              >
                {options}
              </select>
            </div>
            <div className="flex justify-center">
              <label className="mt-4 w-28 text-sm font-medium">
                Withdraw Type
              </label>
              <select
                id="CashApp"
                value={selectedWithdrawal}
                onChange={(e) => setSelectedWithdrawal(e.target.value)}
                className="mt-3 h-9 w-[200px] rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
              >
                <option value="CashApp">CashApp</option>
                <option value="Bitcoin">Bitcoin</option>
                <option value="Venmo">Venmo</option>
                <option value="Paypal">Paypal</option>
                <option value="Zelle">Zelle</option>
              </select>
            </div>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <FormLabel className="mt-3 w-28">Amount</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading || cooldown}
                      {...field}
                      className="w-[200px]"
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9]/g, '');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={loading || cooldown || category !== 'complete'}
            className="ml-[30%] mt-11 w-[40%] p-6 text-white"
            type="submit"
            handleClick={ok}
          >
            {cooldown ? `Waiting (${remainingTime}s)` : 'REQUEST'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
