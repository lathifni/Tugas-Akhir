export const Columns = () => [
  { 
    header: 'No', 
    accessorKey: '', 
    cell: ({ row, table }: { row: any, table: any }) => 
      (table.getSortedRowModel()?.flatRows?.findIndex((flatRow: { id: any; }) => flatRow.id === row.id) || 0) + 1 
  },
  { 
    header: 'Id', 
    accessorKey: 'id',
  },
  { 
    header: 'Description', 
    accessorKey: 'description' 
  },
  { 
    header: 'Status', 
    accessorKey: 'status',
    cell: ({ row }: { row: any }) => (
      row.original.status === 1 ? "Active" : "Not Active"
    )
  }
];
