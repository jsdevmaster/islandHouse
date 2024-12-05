'use client';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';

export default function UserVenmo() {
  const router = useRouter();
  const [data, setData] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/getadmin');
        const result = await response.json();
        setData(result.data[0].venmo);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function qrcodeData() {
      const venmoLink = `https://venmo.com/${data}`;

      try {
        const url = await QRCode.toDataURL(venmoLink);
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Failed to generate QR code', error);
      }
    }

    qrcodeData();
  }, [data]);

  const venmo = () => {
    router.push('/mypage/deposit');
  };

  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      toast({
        title: 'Venmo Copied Successful!',
        description: 'Welcome! Venmo have copied successfully.'
      });
    } else {
      toast({
        title: 'Venmo Copied Failed!',
        description: 'Venmo have copied failed. Please try again!'
      });
    }
  };

  return (
    <div>
      <div className="mt-20 flex justify-center">
        {qrCodeUrl && data !== 'none' && (
          <div className="border p-2">
            <img
              src={qrCodeUrl}
              alt={`QR Code for ${data}`}
              className="w-[200px], h-[200px]"
            />
          </div>
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
      <Button className="ml-[30%] mt-28 w-[40%] border p-6" handleClick={venmo}>
        OK
      </Button>
    </div>
  );
}
