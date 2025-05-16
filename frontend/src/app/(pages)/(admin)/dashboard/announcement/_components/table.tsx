import React, { useState } from 'react';
import { flexRender, useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, SortingState } from '@tanstack/react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import TextField from '@mui/material/TextField';

interface Props {
  columns: any[];
  data: any[];
  onRowDelete: (rowData: any) => void;
  onRowEdit: (rowData: any) => void;
}

export default function TableAnnouncementAdmin({ columns, data, onRowDelete, onRowEdit, }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [filtering, setFiltering] = useState('')
  const table = useReactTable({
    columns: columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering
  })

  const handlingDeleteButton = (data: any) => {
    onRowDelete(data);
  }

  const handlingEditButton = (data: any) => {
    onRowEdit(data)
  }

  return (
    <div>
      {/* <div className='ml-8 flex items-center justify-between'>
        <div className='flex items-center'>
          <TextField label="Global Search" variant="outlined" value={filtering} onChange={(e) => setFiltering(e.target.value)} />
          <p className='ml-4'>Data Found : {table.getRowCount()}</p>
        </div>
      </div> */}
      <div className='overflow-x-auto'>
        <table className='w3-table-all w3-hoverable mt-2 w-auto'>
          <thead className='text-lg'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className='font-semibold select-none' onClick={header.column.getToggleSortingHandler()}>
                    {header.isPlaceholder ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
                <th className='font-semibold select-none'>Actions</th>
              </tr>
            ))}
          </thead>
          <tbody className='text-black'>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className='px-6 py-3 hover:bg-gray-200'>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className='px-1 py-2'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className='px-1 py-2'> {/* Tambahkan kolom Action di sini */}
                  {/* <button className='mx-2 border-2 border-blue-500 p-2 rounded-lg text-blue-500 hover:text-white hover:bg-blue-500 '>
                    <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: '1.3em' }} />
                  </button> */}
                  <button className='mx-2 border-2 border-yellow-500 p-2 rounded-lg text-yellow-500 hover:text-white hover:bg-yellow-500' onClick={() => handlingEditButton(row.original)}>
                    <FontAwesomeIcon icon={faPencil} style={{ fontSize: '1.3em' }} />
                  </button>
                  <button className='mx-2 border-2 border-red-500 p-2 rounded-lg text-red-500 hover:text-white hover:bg-red-500' onClick={() => handlingDeleteButton(row.original)}>
                    <FontAwesomeIcon icon={faTrash} style={{ fontSize: '1.3em' }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='text-center mt-4'>
        <button className='px-2 py-1 bg-slate-300 rounded-lg m-1 hover:bg-slate-500 hover:text-white' onClick={() => table.setPageIndex(0)}>First Page</button>
        <button className='px-2 py-1 bg-slate-300 rounded-lg m-1d disabled:bg-gray-200 hover:bg-slate-500 hover:text-white disabled:cursor-not-allowed' disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>Previus Page</button>
        <strong className='mx-2'>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>

        <button className='px-2 py-1 bg-slate-300 rounded-lg m-1 disabled:bg-gray-200 hover:bg-slate-500 hover:text-white disabled:cursor-not-allowed' disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>Next Page</button>
        <button className='px-2 py-1 bg-slate-300 rounded-lg m-1 hover:bg-slate-500 hover:text-white' onClick={() => table.setPageIndex(table.getPageCount() - 1)}>Last Page</button>
      </div>
      <div className='text-center'>
        <strong>
          Go to page :
          <input type="number" className='w-14 border border-black rounded-md pl-2 ml-1' value={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page)
            }} />
        </strong>
      </div>
    </div>
  )
}