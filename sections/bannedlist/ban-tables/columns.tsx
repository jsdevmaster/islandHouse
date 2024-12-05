'use client';
import { AdminRegisterUsers, UserRegister } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<AdminRegisterUsers, UserRegister>[] = [
  {
    accessorKey: 'id',
    header: 'TAG NUMBER',
    cell: ({ row }) => <span>{row.original.tag}</span>
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    cell: ({ row }) => (
      <span>
        {row.original.firstname} {row.original.lastname}
      </span>
    )
  },
  {
    accessorKey: 'username',
    header: 'USERNAME',
    cell: ({ row }) => <span>{row.original.email}</span>
  },
  {
    accessorKey: 'ip',
    header: 'IP ADDRESS',
    cell: ({ row }) => <span>{row.original.ip}</span>
  },
  {
    accessorKey: 'phonenumber',
    header: 'PHONE NUMBER',
    cell: ({ row }) => (
      <span>
        {row.original.register &&
        row.original.register.length > 0 &&
        row.original.register[0].phonenumber
          ? row.original.register[0].phonenumber
          : 'none'}
      </span>
    )
  },
  {
    id: 'actions',
    header: 'ACTION',
    cell: ({ row }) => <CellAction userId={row.original._id} />
  }
];
