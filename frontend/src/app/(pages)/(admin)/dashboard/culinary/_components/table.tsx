import React, { useState } from 'react';
import { flexRender, useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, SortingState } from '@tanstack/react-table'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Props {
  columns: any[];
  data: any[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onRowDelete: (rowData: any) => void;
}

export default function TableCulinaryAdmin({ columns, data, isOpen, setIsOpen, onRowDelete }: Props) {
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

  const handlingDeleteButton = (data:any) => {
    setIsOpen(!isOpen)
    // setSelectedData(data);
    onRowDelete(data); 
  }

  return (
    <div>
      <table className='w3-table w3-striped w3-bordered w-auto mt-8 '>
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
                <Link href={''}>
                  <button className='mx-2 border-2 border-blue-500 p-2 rounded-lg text-blue-500 hover:text-white hover:bg-blue-500 '>
                    <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: '1.3em' }} />
                  </button>
                </Link>
                <button className='mx-2 border-2 border-red-500 p-2 rounded-lg text-red-500 hover:text-white hover:bg-red-500' onClick={() => handlingDeleteButton(row.original)}>
                  <FontAwesomeIcon icon={faTrash} style={{ fontSize: '1.3em' }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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