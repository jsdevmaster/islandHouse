'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default function UserZelle() {
  const router = useRouter();
  const [data, setData] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const zelle = () => {
    router.push('/mypage/deposit');
  };

  const zelleUri = `zelle:${data}`;

  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      toast({
        title: 'Zelle Copied Successful!',
        description: 'Welcome! Zelle have copied successfully.'
      });
    } else {
      toast({
        title: 'Zelle Copied Failed!',
        description: 'Zelle have copied failed. Please try again!'
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/getadmin');
        const result = await response.json();
        setData(result.data[0].zelle);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <div className="mt-20 flex justify-center">
        {data !== 'none' ? (
          <div className="border p-2">
            <QRCodeSVG value={zelleUri} size={180} level={'H'} />
          </div>
        ) : (
          ''
        )}
      </div>
      <div className="mt-10 flex items-center justify-center">
        <input
          type="text"
          value={data}
          readOnly
          className="w-1/2 rounded-md border p-2 text-center outline-none"
          ref={inputRef}
        />
        <Button className="border py-5" handleClick={copyToClipboard}>
          Copy
        </Button>
      </div>
      <Button className="ml-[30%] mt-28 w-[40%] border p-6" handleClick={zelle}>
        OK
      </Button>
    </div>
  );
}
