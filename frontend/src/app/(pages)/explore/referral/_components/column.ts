export const Columns = () => [
  { header: 'No', accessorKey: '', cell: ({ row, table }: { row: any, table: any }) => (table.getSortedRowModel()?.flatRows?.findIndex((flatRow: { id: any; }) => flatRow.id === row.id) || 0) + 1 },
  { header: 'Id Reservation', accessorKey: 'id_reservation' },
  { header: 'Amount', accessorKey: 'amount', },
  { header: 'Name', accessorKey: 'fullname' },
  { 
    header: 'Status', 
    accessorKey: 'referral_check',
    cell: ({ row }: { row: any }) => {
      const referralCheck = row.original.referral_check;
      if (referralCheck === undefined || referralCheck === null) {
        return "Not Processed";
      } else if (referralCheck === 0) {
        return "Not Accepted";
      } else if (referralCheck === 1) {
        return "Success";
      } else {
        return "Unknown Status"; // Optional: handle other unexpected cases
      }
    }
  }
];