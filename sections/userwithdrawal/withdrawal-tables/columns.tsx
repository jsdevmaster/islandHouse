'use client';
import { PaymentWithdrawals } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<PaymentWithdrawals>[] = [
  {
    accessorKey: 'paymentoption',
    header: 'Game'
  },
  {
    accessorKey: 'paymenttype',
    header: 'Type'
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => `$${row.original.amount}`
  },
  {
    accessorKey: 'paymentstatus',
    header: 'Status'
  },
  {
    accessorKey: 'date',
    header: 'Date/Time',
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${month}/${day} ${year.toString().slice(-2)} ${hours}:${minutes}`;
    }
  }
];
