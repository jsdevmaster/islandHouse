'use client';

import { AdminRegisterUsers, Paymentredeems } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { CheckboxDaily } from './checkboxdaily';
import { CheckboxBonus } from './checkboxbonus';
import { AmountAction } from './amount';
import { Checkbox } from '@/components/ui/checkbox';
import useSocket from '@/lib/socket';

const { socket } = useSocket();

export const columns: ColumnDef<AdminRegisterUsers & Paymentredeems>[] = [
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
              socket?.emit('selectAllIds', idsAndDates);
            } else {
              socket?.emit('selectAllIds', '');
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
            socket?.emit('selectIds', idsAndDate);
          } else {
            const deleteId = {
              date: row.original.date
            };
            socket?.emit('selectIds', deleteId);
          }
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'id',
    header: 'TAG NUMBER',
    cell: ({ row }) => <span>{row.original.user.tag}</span>
  },
  {
    accessorKey: 'paymentoption',
    header: 'GAME'
  },
  {
    accessorKey: 'username',
    header: 'USERNAME',
    cell: ({ row }) => (
      <span>
        {' '}
        {row.original.user.firstname} {row.original.user.lastname}{' '}
      </span>
    )
  },
  {
    accessorKey: 'user.loginid',
    header: 'GAME ID',
    cell: ({ row }) => <span>{row.original.user.register[0].loginid}</span>
  },
  {
    accessorKey: 'paymenttype',
    header: 'TYPE'
  },
  {
    id: 'amount',
    header: 'AMOUNT',
    cell: ({ row }) => (
      <AmountAction
        redeemDate={row.original.date}
        userId={row.original.user._id}
        redeemAmount={row.original.amount}
        bitcoin={row.original.btc}
      />
    )
  },
  {
    id: 'daily',
    header: 'Daily',
    cell: ({ row }) => (
      <CheckboxDaily
        redeemDate={row.original.date}
        userId={row.original.user._id}
        checkboxStatus={row.original.dailyChecked}
      />
    )
  },
  {
    id: 'bonus',
    header: 'BONUS',
    cell: ({ row }) => (
      <CheckboxBonus
        redeemDate={row.original.date}
        userId={row.original.user._id}
        checkboxStatus={row.original.bonusChecked}
      />
    )
  },
  {
    accessorKey: 'date',
    header: 'TIME',
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${month}/${day} ${year.toString().slice(-2)} ${hours}:${minutes}`;
    }
  },
  {
    id: 'actions',
    header: 'ACTION',
    cell: ({ row }) => (
      <CellAction
        Date={row.original.date}
        userId={row.original.user._id}
      />
    )
  }
];
