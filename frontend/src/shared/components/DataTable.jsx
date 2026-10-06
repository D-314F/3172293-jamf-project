import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel
} from "@tanstack/react-table"

import { useState } from "react"
import { Button } from "@/shared";

export default function DataTable({ data, columns }) {

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  })

  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-4">

      {/* TOOLBAR RESPONSIVA: En móvil se apilan en vertical */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">

        {/* BUSCADOR */}
        <input
          type="text"
          placeholder="Buscar..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border border-white text-white rounded px-3 py-2 w-full sm:w-64"
        />

        {/* SELECTOR DE FILAS */}
        <div className="flex justify-end">
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border bg-white rounded px-2 py-2"
          >
            {[5, 7, 10, 20, 50].map(size => (
              <option key={size} value={size}>
                {size} filas
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* TABLA: Con contenedor overflow-x-auto para evitar desbordes en móvil */}
      <div className="overflow-x-auto border border-white rounded">
        <table className="w-full">

          <thead className="bg-gray-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="p-3 text-left border-b whitespace-nowrap"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-amber-600 bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-3 border-b whitespace-nowrap">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* FOOTER RESPONSIVO: Flex-wrap en los botones para que quepan en móviles */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">

        <span className="text-sm text-white text-center md:text-left">
          Mostrando {table.getRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} registros
        </span>

        {/* CONTROLES CON FLEX-WRAP (Evita que el botón Final desaparezca) */}
        <div className="flex flex-wrap items-center justify-center gap-2">

          <Button
            size="sm"
            variant="secondary"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            Inicio
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>

          <span className="text-sm text-white px-2 whitespace-nowrap">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </span>

          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>

          <Button
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Final
          </Button>

        </div>

      </div>

      {/* IR A PÁGINA */}
<div className="flex items-center gap-2 text-sm pt-2 text-[var(--color-text-inverse)]">
  <span>Ir a página:</span>
  <input
    type="number"
    value={table.getState().pagination.pageIndex + 1}
    onChange={(e) => {
      const page = e.target.value ? Number(e.target.value) - 1 : 0;
      table.setPageIndex(page);
    }}
    className="border border-[var(--color-brand)] font-semibold rounded px-2 py-1 w-16 text-center focus:outline-none"
  />
</div>

    </div>
  )
}