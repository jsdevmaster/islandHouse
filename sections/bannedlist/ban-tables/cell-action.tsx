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
import { ArchiveRestore, InfoIcon, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

interface CellActionProps {
  codeRegister?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  userId: string;
}

export const CellAction: React.FC<CellActionProps> = ({ userId }) => {
  const router = useRouter();
  const [loading, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    startTransition(async () => {
      try {
        const response = await deleteRegister({
          id: userId
        });

        if (response.error) {
          return;
        }

        setOpen(false);

        toast({
          title: 'Delete successful!',
          description: 'You have verified customer redeem'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Delete Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const deleteRegister = async (userData: { id: string }) => {
    try {
      const response = await fetch('/api/admin/userdelete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Delete failed' };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const userdetail = () => {
    router.push(`/main/user/userdetail?id=${userId}`);
  };

  const restore = async () => {
    startTransition(async () => {
      try {
        const response = await userList({
          id: userId,
          action: 'yes'
        });

        if (response.error) {
          return;
        }

        toast({
          title: 'User Restored Successful!',
          description: 'User have restored successful!'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'User Restored Failed!',
          description: 'Your action has been failed. Please try again!'
        });
      }
    });
  };

  const userList = async (userData: { action: string; id: string }) => {
    try {
      const response = await fetch('/api/admin/userrestore', {
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

  const ok = () => {};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" handleClick={ok}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuItem onClick={userdetail}>
            <InfoIcon className="mr-2 h-4 w-4" /> User Detail
          </DropdownMenuItem>
          <DropdownMenuItem onClick={restore}>
            <ArchiveRestore className="mr-2 h-4 w-4" />
            Restore
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
