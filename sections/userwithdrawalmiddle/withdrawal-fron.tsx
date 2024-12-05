// UserRegistrationForm.client.js
'use client'; // Ensures this is recognized as a client component

import { useTransition } from 'react';
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
  paymentgateway: z.string()
});

const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
type UserFormValue = z.infer<typeof formSchema>;

export default function UserWithdrawalMiddle() {
  const router = useRouter();
  const [loading, startTransition] = useTransition();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: UserFormValue) => {
    startTransition(async () => {
      const response = await signUp({
        paymentgateway: data.paymentgateway,
        token: userInfo.token
      });

      if (response.error) {
        console.error('Signup error:', response.error);
        return;
      }

      toast({
        title: 'Withdrawal Request Successful!',
        description: 'Welcome! Your withdrawal has been request.'
      });

      router.push('/mypage/withdrawal');
    });
  };

  const signUp = async (userData: {
    paymentgateway: string;
    token: string;
  }) => {
    try {
      const response = await fetch('/api/customer/withdrawalrequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Signup failed' };
      }

      return await response.json();
    } catch (error) {
      console.error('Error during fetch:', error);
      throw error;
    }
  };

  const withdrawalmiddle = () => {};

  return (
    <div>
      <div className="rounded-xl border border-4 border-solid border-gray-500 bg-white p-3">
        <p className="text-center font-semibold text-red-500">※Warning※</p>
        <p className="mt-1 text-center text-sm font-semibold text-black">
          You must enter your account information correctly. Be careful not to
          enter incorrect information. Thank you.
        </p>
        <p className="mt-1 text-center text-xs text-black">Venmo: @username</p>
        <p className="mt-1 text-center text-xs text-black">CashApp: $CashTag</p>
        <p className="mt-1 text-center text-xs text-black">
          Zelle: Email or Phone Number
        </p>
        <p className="mt-1 text-center text-xs text-black">
          Paypal: @username or Email
        </p>
        <p className="mt-1 text-center text-xs text-black">
          Bitcoin: BTC Address
        </p>
      </div>
      <br />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <div>
            <FormField
              control={form.control}
              name="paymentgateway"
              render={({ field }) => (
                <FormItem className="ml-[25%] mt-10 w-[50%]">
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={loading}
            className="ml-[25%] mt-32 w-[50%] p-6"
            handleClick={withdrawalmiddle}
          >
            REQUEST
          </Button>
        </form>
      </Form>
    </div>
  );
}
