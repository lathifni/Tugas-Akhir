import moment from "moment";

export const Columns = () => [
  { header: 'No', accessorKey: '', cell: ({ row, table }: { row: any, table: any }) => (table.getSortedRowModel()?.flatRows?.findIndex((flatRow: { id: any; }) => flatRow.id === row.id) || 0) + 1 },
  { header: 'Id', accessorKey: 'id', },
  { header: 'Package', accessorKey: 'name' },
  { header: 'Request', accessorKey: 'request_date', cell: (info: any) => moment(info.getValue()).utc(true).format('DD-MM-YYYY') },
  { header: 'Check In', accessorKey: 'check_in', cell: (info: any) => moment(info.getValue()).utc(true).format('dddd, DD MMMM YYYY, HH:MM') },
  { header: 'Status', accessorKey: 'status' },
];