'use client';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import useSocket from '@/lib/socket';
import { useRouter } from 'next/navigation';

interface UserData {
  date: any;
  codenumber: string;
}

const { socket } = useSocket();
const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

export const CodeAction = ({
  codeNumber,
  statusNow,
  registerDate
}: {
  codeNumber: string;
  statusNow: string;
  registerDate: any;
}) => {
  const router = useRouter();
  const [codenum, setCodenum] = useState('');
  const [isCooldown, setIsCooldown] = useState(false);

  const userData = {
    token: userInfo.token,
    date: registerDate,
    codenumber: codenum,
    status: 'complete'
  };

  const onSubmit = async (userData: UserData) => {
    try {
      const response = await fetch('/api/customer/coderegister', {
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

      socket?.emit('userVerify', {
        userId: userInfo.userId,
        message: `${userInfo.name} received login id and password code!`
      });

      router.push('/mypage/promotion');

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const onVerify = async () => {
    const response = await onSubmit(userData);
    if (response && response.error) {
      toast({
        title: 'Codenumber Verify Failed',
        description: 'Please try again.'
      });
    } else {
      toast({
        title: 'Codenumber Verify Successful',
        description: 'Welcome! Your codenumber has been verified.'
      });
    }
  };

  useEffect(() => {
    if (statusNow === 'complete' && codeNumber) {
      setCodenum(codeNumber);
    } else {
      setCodenum('');
    }
  }, [codeNumber, statusNow]);

  return (
    <div className="flex w-full justify-center">
      <input
        value={codenum}
        className="w-32 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        onChange={(e) => setCodenum(e.target.value)}
        disabled={statusNow === 'complete' || isCooldown} // Disable input during cooldown
      />
      <Button
        className="ml-1 h-8 w-12 bg-green-500 text-xs text-white"
        handleClick={onVerify}
        disabled={
          codeNumber === 'none' || statusNow === 'complete' || isCooldown
        } // Disable button during cooldown
      >
        Verify
      </Button>
    </div>
  );
};
