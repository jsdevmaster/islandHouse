'use client';
import { AdminRegisterUsers, UserRegister } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<AdminRegisterUsers & UserRegister>[] = [
  {
    accessorKey: 'category',
    header: 'GAME',
    cell: ({ row }) => <span>{row.original.category}</span>
  },
  {
    accessorKey: 'loginid',
    header: 'User ID',
    cell: ({ row }) => <span>{row.original.loginid}</span>
  },
  {
    accessorKey: 'passwordcode',
    header: 'Password',
    cell: ({ row }) => <span>{row.original.passwordcode}</span>
  },
  {
    id: 'actions',
    header: 'ACTION',
    cell: ({ row }) => (
      <CellAction
        registerDate={row.original.date}
        userId={row.original.user._id}
      />
    )
  }
];
