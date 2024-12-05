'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import useSocket from '@/lib/socket';

const { socket } = useSocket();

const formSchema = z.object({
  phonenumber: z.string()
});

const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

type UserFormValue = z.infer<typeof formSchema>;

const COOLDOWN_KEY = 'cooldown_data';

export default function UserRegistrationForm() {
  const [loading, startTransition] = useTransition();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  });

  const [selectedOption, setSelectedOption] = useState('FireKirin');
  const [cooldown, setCooldown] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30);

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
            localStorage.removeItem(COOLDOWN_KEY); // Clean up when cooldown ends
            return 30;
          }
          return prev - 1;
        });
      }, 1000);

      // Save cooldown state to localStorage
      localStorage.setItem(
        COOLDOWN_KEY,
        JSON.stringify({ cooldown, remainingTime })
      );

      return () => {
        clearInterval(intervalId);
      };
    } else {
      // Remove cooldown data from localStorage when not in cooldown
      localStorage.removeItem(COOLDOWN_KEY);
    }
  }, [cooldown, remainingTime]);

  const onSubmit = async (data: UserFormValue) => {
    if (cooldown) return;

    startTransition(async () => {
      try {
        const response = await userRegister({
          category: selectedOption,
          phonenumber: data.phonenumber,
          token: userInfo.token,
          status: 'Processing',
          id: userInfo.userId
        });

        if (response.error) {
          console.error('UserRegister error:', response.error);
          return;
        }

        toast({
          title: 'Register Successful',
          description: 'Welcome! Your register has been requested.'
        });

        socket?.emit('userRegister', {
          userId: userInfo.userId,
          message: `${userInfo.name} requested codenumber!`
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

        location.reload();
      } catch (error) {
        toast({
          title: 'Register Failed',
          description:
            'There was an error registering your account. Please try again.'
        });
      }
    });
  };

  const userRegister = async (userData: {
    category: string;
    phonenumber: string;
    token: string;
    status: string;
    id: string;
    
  }) => {
    try {
      const response = await fetch('/api/customer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'UserRegister failed' };
      }

      return await response.json();
    } catch (error) {
      console.error('Error during fetch:', error);
      throw error;
    }
  };

  const ok = () => {};
 
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <div className="grid grid-cols-3 gap-5">
            <div className="flex flex-col">
              <label className="text-sm font-medium">Category</label>
              <select
                id="FireKirin"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mt-3 h-9 rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
              >
                <option value="FireKirin">FireKirin</option>
                <option value="MilkyWay">MilkyWay</option>
                <option value="OrionStars">OrionStars</option>
                <option value="Juwa">Juwa</option>
                <option value="GameVault">GameVault</option>
                <option value="VegasSweep">VegasSweep</option>
                <option value="YOLO">YOLO</option>
                <option value="UltraPanda">UltraPanda</option>
                <option value="VBlink">VBlink</option>
              </select>
            </div>
            <FormField
              control={form.control}
              name="phonenumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={loading || cooldown}
                      {...field}
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
            <Button
              type="submit"
              disabled={loading || cooldown}
              className="ml-auto mt-8 w-full text-white"
              handleClick={ok}
            >
              {cooldown ? `Waiting (${remainingTime}s)` : 'Send Code'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
