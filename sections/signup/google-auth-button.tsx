'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function GoogleSignUpButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      handleClick={() =>
        signIn('google', { callbackUrl: callbackUrl ?? '/mypage' })
      }
    >
      <Image
        src="/google.png"
        width={20}
        height={20}
        alt="google icon"
        className="mr-3"
      />
      Continue with Google
    </Button>
  );
}
