'use client';
import { UserRegister } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CodeAction } from './code-number';

export const columns: ColumnDef<UserRegister>[] = [
  {
    accessorKey: 'category',
    header: 'GAME'
  },
  {
    accessorKey: 'status',
    header: 'STATUS'
  },
  {
    id: 'actions',
    header: 'CODE NUMBER',
    cell: ({ row }) => (
      <CodeAction
        codeNumber={row.original.codenumber}
        statusNow={row.original.status}
        registerDate={row.original.date}
      />
    )
  },
  {
    accessorKey: 'phonenumber',
    header: 'PHONE NUMBER'
  }
];
