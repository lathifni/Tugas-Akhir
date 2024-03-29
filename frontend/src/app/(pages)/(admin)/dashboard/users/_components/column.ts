export const Columns = () => [
  { header: 'No', accessorKey: '', cell: ({ row, table }: { row: any, table: any }) => (table.getSortedRowModel()?.flatRows?.findIndex((flatRow: { id: any; }) => flatRow.id === row.id) || 0) + 1 },
  { header: 'ID', accessorKey: 'id', },
  { header: 'Username', accessorKey: 'username' },
  { header: 'Fullname', accessorKey: 'fullname' },
  { header: 'Email', accessorKey: 'email' },
];