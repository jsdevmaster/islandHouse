'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';
import useSocket from '@/lib/socket';
import { useRouter } from 'next/navigation';
import GoogleSignInButton from './google-auth-button';

const { socket } = useSocket();

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const [loading, startTransition] = useTransition();
  const [pop, setPop] = useState<boolean>(false);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: UserFormValue) => {
    startTransition(async () => {
      try {
        const response = await signIn({
          email: data.email,
          password: data.password
        });

        if (response.user.role === 'admin') {
          router.push('/main');
        } else {
          router.push('/mypage');
        }
        localStorage.setItem('userinfo', JSON.stringify(response.user));
        socket?.emit('register', {
          userId: response.user.userId,
          role: response.user.role
        });

        toast({
          title: 'SignIn Successful!',
          description: 'Welcome! Your signin has been success.'
        });
      } catch (error) {
        console.error('Signup error:', error);
      }
    });
  };

  const signIn = async (userData: { email: string; password: string }) => {
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.status === 402) {
        setPop(true);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: 'SignIn Failed!',
          description: 'Your email or password is incorrect! Please try again.'
        });
        return { error: errorData.message || 'Signin failed' };
      }

      return await response.json();
    } catch (error) {
      console.error('Error during fetch:', error);
      throw error;
    }
  };

  const ok = () => {};

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto w-full" type="submit" handleClick={ok}>
            LOG IN
          </Button>
          {pop ? (
            <div className="rounded-lg border border-red-500 p-1 text-center text-red-500">
              Sorry, your action has been benned!
            </div>
          ) : (
            ''
          )}
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GoogleSignInButton />
    </>
  );
}
