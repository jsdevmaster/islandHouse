'use client';
import { AdminRegisterUsers, UserRegister } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { LoginIdAction } from './login-id';
import { Checkbox } from '@/components/ui/checkbox';
import useSocket from '@/lib/socket';

const { socket } = useSocket();

export const columns: ColumnDef<AdminRegisterUsers & UserRegister>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value);
          setTimeout(() => {
            if (value) {
              const selectedRows = table
                .getRowModel()
                .rows.filter((row) => row.getIsSelected());
              const idsAndDates = selectedRows.map((row) => ({
                id: row.original.user?._id,
                date: row.original.date
              }));
              socket?.emit('selectCodeVerifyAllIds', idsAndDates);
            } else {
              socket?.emit('selectCodeVerifyAllIds', '');
            }
          }, 0);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
          if (value) {
            const idsAndDate = {
              id: row.original.user?._id,
              date: row.original.date
            };
            socket?.emit('selectCodeVerifyIds', idsAndDate);
          } else {
            const deleteId = {
              date: row.original.date
            };
            socket?.emit('selectCodeVerifyIds', deleteId);
          }
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'tag',
    header: 'TAG NUMBER',
    cell: ({ row }) => <span>{row.original.user.tag}</span>
  },
  {
    accessorKey: 'username',
    header: 'USERNAME',
    cell: ({ row }) => (
      <span>
        {row.original.user.firstname} {row.original.user.lastname}
      </span>
    )
  },
  {
    accessorKey: 'phonenumber',
    header: 'PHONE NUMBER'
  },
  {
    accessorKey: 'category',
    header: 'REGISTER TYPE'
  },
  {
    id: 'actions',
    header: 'LOGIN ID AND PASSWORD CODE',
    cell: ({ row }) => (
      <LoginIdAction
        dateV={row.original.date}
        loginIdV={row.original.loginid}
        passwordCodeV={row.original.passwordcode}
        userName={row.original.user._id}
      />
    )
  },
  {
    id: 'actions',
    header: 'ACTION',
    cell: ({ row }) => (
      <CellAction
        phoneNumber={row.original.phonenumber}
        userId={row.original.user._id}
      />
    )
  }
];
