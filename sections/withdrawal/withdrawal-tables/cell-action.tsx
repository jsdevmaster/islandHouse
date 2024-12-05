'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CheckCircle, MoreHorizontal,X } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from '@/components/ui/use-toast';

interface CellActionProps {
  withdrawalDate: Date,
  userId: any
}

export const CellAction: React.FC<CellActionProps> = ({
  withdrawalDate,
  userId
}: any) => {
  const [loading, startTransition] = useTransition();

  const withdrawal = async () => {
    startTransition(async () => {
      try {
        const response = await userWithdrawalCheck({
          paymentstatus: 'complete',
          date: withdrawalDate,
          id: userId
        });

        if (response.error) {
          console.error('Withdrawal error:', response.error);
          return;
        }

        toast({
          title: 'Withdrawal Verify Successful!',
          description: 'You have verified customer redeem'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Withdrawal Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const userWithdrawalCheck = async (userData: {
    paymentstatus: string;
    date: any;
    id: string;
  }) => {
    try {
      const response = await fetch('/api/admin/withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Withdrawal failed' };
      }

      return await response.json();
    } catch (error) {
      console.error('Error during fetch:', error);
      throw error;
    }
  };

  const unwithdrawal = async () => {
    startTransition(async () => {
      try {
        const response = await userUnwithdrawalCheck({
          paymentstatus: 'decline',
          date: withdrawalDate,
          id: userId
        });

        if (response.error) {
          console.error('Decline error:', response.error);
          return;
        }

        toast({
          title: 'Decline Successful!',
          description: 'You have declined successful!'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Decline Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const userUnwithdrawalCheck = async (userData: {
    paymentstatus: string;
    date: any;
    id: string;
  }) => {
    try {
      const response = await fetch('/api/admin/withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Decline failed' };
      }

      return await response.json();
    } catch (error) {
      console.error('Error during fetch:', error);
      throw error;
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or loading message if needed
  }

  const ok = () => {};

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" handleClick={ok}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuItem onClick={withdrawal}>
            <CheckCircle className="mr-2 h-4 w-4" /> Accept
          </DropdownMenuItem>
          <DropdownMenuItem onClick={unwithdrawal}>
            <X className="mr-2 h-4 w-4" /> Decline
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
