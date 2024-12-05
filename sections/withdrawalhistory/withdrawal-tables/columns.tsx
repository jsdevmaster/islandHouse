'use client';
import { AdminRegisterUsers, PaymentWithdrawals } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import useSocket from '@/lib/socket';

const { socket } = useSocket();

export const columns: ColumnDef<AdminRegisterUsers & PaymentWithdrawals>[] = [
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
              socket?.emit('selectWithdrawalHistoryAllIds', idsAndDates);
            } else {
              socket?.emit('selectWithdrawalHistoryAllIds', '');
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
            socket?.emit('selectWithdrawalHistoryIds', idsAndDate);
          } else {
            const deleteId = {
              date: row.original.date
            };
            socket?.emit('selectWithdrawalHistoryIds', deleteId);
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
        {row.original.user.firstname} {row.original.user.lastname}
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
    accessorKey: 'amount',
    header: 'AMOUNT'
  },
  {
    accessorKey: 'paymentgateway',
    header: 'CASHTAG OR BTC ADDRESS'
  },
  {
    accessorKey: 'date',
    header: 'REQUEST TIME',
    cell: ({ row }) => {
      const date = new Date(row.original.date); // Pass the date string to the Date constructor
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-11) and pad with leading zero
      const day = String(date.getDate()).padStart(2, '0'); // Get day (1-31) and pad with leading zero
      const year = date.getFullYear(); // Get full year
      const hours = String(date.getHours()).padStart(2, '0'); // Get hours (0-23) and pad with leading zero
      const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes (0-59) and pad with leading zero

      // Format like "10/16 24 15:16"
      return `${month}/${day} ${year.toString().slice(-2)} ${hours}:${minutes}`;
    }
  },
  {
    accessorKey: 'comdate',
    header: 'COMPLETE TIME',
    cell: ({ row }) => {
      const date = new Date(row.original.comdate); // Pass the date string to the Date constructor
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-11) and pad with leading zero
      const day = String(date.getDate()).padStart(2, '0'); // Get day (1-31) and pad with leading zero
      const year = date.getFullYear(); // Get full year
      const hours = String(date.getHours()).padStart(2, '0'); // Get hours (0-23) and pad with leading zero
      const minutes = String(date.getMinutes()).padStart(2, '0'); // Get minutes (0-59) and pad with leading zero

      // Format like "10/16 24 15:16"
      return `${month}/${day} ${year.toString().slice(-2)} ${hours}:${minutes}`;
    }
  },
  {
    id: 'actions',
    header: 'ACTION',
    cell: ({ row }) => (
      <CellAction
        withdrawalDate={row.original.date}
        userId={row.original.user._id}
      />
    )
  }
];
