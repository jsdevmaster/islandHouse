'use client';
import { AdminRegisterUsers, PaymentWithdrawals } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<PaymentWithdrawals & AdminRegisterUsers>[] = [
  {
    accessorKey: 'paymentoption',
    header: 'Game'
  },
  {
    accessorKey: 'tag',
    header: 'Tag Number',
    cell: ({ row }) => <span>{row.original.user.tag}</span>
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => `$${row.original.amount}`
  }
];
