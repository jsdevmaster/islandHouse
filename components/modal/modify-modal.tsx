'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { toast } from '../ui/use-toast';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  id: string;
  loading: boolean;
}

interface UserData {
  id: string;
  date: any;
  category: string;
  loginid: string;
  passwordcode: string;
}

export const ModifyModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  date,
  id,
  loading
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [loginId, setLoginId] = useState('');
  const [passwordCode, setPasswordCode] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const userData: UserData = {
    id: id,
    date: date,
    category: selectedOption,
    loginid: loginId,
    passwordcode: passwordCode
  };

  const onSubmit = async (userData: UserData) => {
    if (loginId === '' || passwordCode === '') {
      toast({
        title: 'All field do not full!',
        description: 'Please try, again!'
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/usermodify', {
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
        title: 'Modify Successful!',
        description: 'Welcome! User info has been modified.'
      });

      location.reload();

      return await response.json();
    } catch (error) {
      toast({
        title: 'Modify Failed!',
        description: 'User info modify has failed. Please try again.'
      });
      throw error;
    }
  };

  const onConfirm = async () => {
    const response = await onSubmit(userData);

    if (response && response.error) {
    } else {}
  };

  return (
    <Modal
      title="User Detail Info Modify"
      description="You can modify user datail info in here."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col">
        <label className="text-sm font-medium">Game</label>
        <select
          id="FireKirin"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="mt-1 h-9 rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
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
        <label className="mt-3 text-sm font-medium">User ID</label>
        <input
          className="mt-1 h-9 rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
          onChange={(e) => setLoginId(e.target.value)}
        />
        <label className="mt-3 text-sm font-medium">Password</label>
        <input
          className="mt-1 h-9 rounded-md border bg-background p-2 text-sm outline-none focus:border-[#DAAC95]"
          onChange={(e) => setPasswordCode(e.target.value)}
        />
      </div>
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" handleClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          variant="destructive"
          handleClick={onConfirm}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};
