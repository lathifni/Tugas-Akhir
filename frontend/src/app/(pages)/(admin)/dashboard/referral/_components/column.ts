export const Columns = () => [
  { header: 'No', accessorKey: '', cell: ({ row, table }: { row: any, table: any }) => (table.getSortedRowModel()?.flatRows?.findIndex((flatRow: { id: any; }) => flatRow.id === row.id) || 0) + 1 },
  { header: 'Id Reservation', accessorKey: 'id_reservation' },
  { header: 'Id', accessorKey: 'id', },
  { header: 'Name', accessorKey: 'fullname' },
  { 
    header: 'Status', 
    accessorKey: 'referral_check',
    cell: ({ row }: { row: any }) => (
      row.original.referral_check === 1 ? "Done" : "In Progress"
    )
  }
];