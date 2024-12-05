'use client';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

import useSocket from '@/lib/socket';

const { socket } = useSocket();

interface UserData {
  id: string;
  codenumber: string;
  date: any;
}

export const CodeAction = ({
  registerDate,
  codeNumber,
  userName,
  regiStatus
}: {
  registerDate: any;
  codeNumber?: string;
  userName: string;
  regiStatus: string;
}) => {
  const [codenum, setCodenum] = useState(codeNumber || ''); // Initialize with codeNumber if available

  console.log(registerDate);

  const userData: UserData = {
    id: userName,
    codenumber: codenum,
    date: registerDate
  };

  // Example signUp function
  const onSubmit = async (userData: UserData) => {
    if (codenum === '' || codenum === 'none') {
      toast({
        title: 'Code Number  empty!',
        description: 'Please input code number!'
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/coderegister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Code sending failed' };
      }

      toast({
        title: 'Code Sending Successful!',
        description: 'Welcome! Your code sending has been successful.'
      });

      socket?.emit('adminRegister', {
        receiveuserId: userName,
        message: 'Client sent codenumber to you!'
      });

      location.reload();

      return await response.json();
    } catch (error) {
      toast({
        title: 'Code Sending Failed!',
        description: 'Your code sending has failed. Please try again.'
      });
      throw error;
    }
  };

  // Function to handle button click
  const handleButtonClick = async () => {
    const response = await onSubmit(userData);

    // Handle the response or error here
    if (response && response.error) {
      console.error(response.error);
    } else {
      console.log('Success:', response);
    }
  };

  useEffect(() => {
    if (codeNumber) {
      setCodenum(codeNumber);
    } else {
      setCodenum('');
    }
  }, [codeNumber]);

  return (
    <div className="relation flex justify-center">
      <input
        className=" w-32 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        value={codenum}
        onChange={(e) => setCodenum(e.target.value)}
        disabled={regiStatus !== 'preparing' || codeNumber !== 'none'}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          target.value = target.value.replace(/[^0-9]/g, ''); 
        }}
      />
      <Button
        className="ml-1 h-8 w-10 bg-blue-500 text-xs text-white"
        handleClick={handleButtonClick}
        disabled={regiStatus !== 'preparing' || codeNumber !== 'none'}
      >
        SEND
      </Button>
    </div>
  );
};
