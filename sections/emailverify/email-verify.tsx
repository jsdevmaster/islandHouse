'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const verifyEmail = localStorage.getItem('verifyemail');
const userEmail = verifyEmail ? JSON.parse(verifyEmail) : {};

export default function EmailVerifySendPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const verifyCode = async () => {
    setLoading(true);
    setMessage('');

    const code = Math.floor(100000 + Math.random() * 900000);

    try {
      let response = await fetch('/api/sendemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail, code })
      });

      let data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email.');
      }

      response = await fetch('/api/emailcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail, code })
      });

      data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save code in database.');
      }

      setMessage('Verification email sent and code saved successfully!');
      router.push('/emailcodeverify');
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[100vh] w-full items-center justify-center ">
      <div className="h-52 w-[350px] border border-2 p-8 md:w-1/3">
        <h1 className="text-center text-2xl font-semibold tracking-tight">
          Email Verification
        </h1>
        <h3 className="mt-5 text-center">
          Click the button below to verify your email.
        </h3>
        <div className="mt-5 flex w-full justify-center">
          <Button
            variant="default"
            handleClick={verifyCode}
            disabled={loading}
            className="w-96 text-white"
          >
            {loading ? 'Sending...' : 'Send Email Verify'}
          </Button>
        </div>
        {message && <p className="mt-3 text-center text-red-600">{message}</p>}
      </div>
    </div>
  );
}
