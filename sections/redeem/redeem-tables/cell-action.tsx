'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CheckCircle, MoreHorizontal, X } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from '@/components/ui/use-toast';

interface CellActionProps {
  Date: Date;
  userId: any;
}

export const CellAction: React.FC<CellActionProps> = ({
  Date,
  userId
}:{Date:Date; userId:any;}) => {
  const [loading, startTransition] = useTransition();

  const accept = async () => {
    startTransition(async () => {
      try {
        const response = await userredeemCheck({
          id: userId,
          paymentstatus: 'complete',
          date: Date
        });

        if (response.error) {
          return;
        }

        toast({
          title: 'Accept Successful!',
          description: 'You have accepted successful!'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Accept Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const userredeemCheck = async (userData: {
    paymentstatus: string;
    id: string;
    date: any;
  }) => {
    try {
      const response = await fetch('/api/admin/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'redeem failed' };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const unredeem = async () => {
    startTransition(async () => {
      try {
        const response = await userUnredeemCheck({
          id: userId,
          paymentstatus: 'decline',
          date: Date
        });

        if (response.error) {
          return;
        }

        toast({
          title: 'Decline Successful!',
          description: 'You have declined successful!'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'redeem Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const userUnredeemCheck = async (userData: {
    paymentstatus: string;
    id: string;
    date: any;
  }) => {
    try {
      const response = await fetch('/api/admin/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'redeem failed' };
      }

      return await response.json();
    } catch (error) {
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
          <DropdownMenuItem onClick={accept}>
            <CheckCircle className="mr-2 h-4 w-4" /> Accept
          </DropdownMenuItem>
          <DropdownMenuItem onClick={unredeem}>
            <X className="mr-2 h-4 w-4" /> Decline
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
