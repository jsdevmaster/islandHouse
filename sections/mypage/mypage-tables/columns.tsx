'use client';
import { UserRegister } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<UserRegister>[] = [
  {
    accessorKey: 'category',
    header: 'GAME'
  },
  {
    accessorKey: 'loginid',
    header: 'User ID'
  },
  {
    accessorKey: 'passwordcode',
    header: 'Password'
  }
];
