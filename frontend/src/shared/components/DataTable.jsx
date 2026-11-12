// src/shared/components/DataTable.jsx
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/shared";

export default function DataTable({ data, columns }) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, pagination },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4 font-[var(--font-body)]">

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="
            bg-[var(--color-background-inverse)]
            border border-[var(--color-border)]
            text-[var(--color-text-inverse)]
            placeholder:text-[var(--color-text-muted)]
            rounded-xl px-4 py-3
            w-full sm:w-72
            text-body
            font-[var(--font-body)]
            focus:outline-none focus:ring-2
            focus:ring-[var(--color-brand)]
            focus:border-[var(--color-brand)]
            transition
          "
        />

        {/* Selector de filas */}
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="
            bg-[var(--color-background-inverse)]
            border border-[var(--color-border)]
            text-[var(--color-text-inverse)]
            rounded-xl px-4 py-3
            text-body
            font-[var(--font-label)]
            cursor-pointer
            focus:outline-none focus:ring-2
            focus:ring-[var(--color-brand)]
            transition
          "
        >
          {[5, 7, 10, 20, 50].map((size) => (
            <option
              key={size}
              value={size}
              className="bg-[var(--color-background-inverse)]"
            >
              {size} filas
            </option>
          ))}
        </select>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto border border-[var(--color-border)]/60 rounded-2xl shadow-inner">
        <table className="w-full border-collapse">
          <thead className="bg-[var(--color-surface-muted)]/20 border-b border-[var(--color-border)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="
                      px-5 py-4
                      text-left
                      text-body
                      font-[var(--font-heading)]
                      text-[var(--color-brand)]
                      uppercase tracking-wide
                      whitespace-nowrap
                    "
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-body text-[var(--color-text-muted)] font-[var(--font-body)]"
                >
                  Sin resultados
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="
                    border-b border-[var(--color-border)]/40
                    hover:bg-[var(--color-brand)]/10
                    text-[var(--color-text-inverse)]
                    transition-colors
                  "
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-5 py-4 text-body font-[var(--font-body)] whitespace-nowrap"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER / PAGINACIÓN */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
        {/* Total registros */}
        <span className="text-medium text-[var(--color-text-muted)] font-[var(--font-body)] text-center md:text-left">
          Mostrando {table.getRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} registros
        </span>

        {/* Botones de página */}
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

          <span className="text-medium font-[var(--font-label)] text-[var(--color-text-inverse)] px-2 whitespace-nowrap">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}
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

        {/* Ir a página */}
        <div className="flex items-center gap-2 text-medium text-[var(--color-text-muted)] font-[var(--font-body)]">
          Ir a página:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            min={1}
            max={table.getPageCount()}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="
              w-16
              bg-[var(--color-background-inverse)]
              border border-[var(--color-border)]
              text-[var(--color-text-inverse)]
              rounded-lg px-2 py-1.5
              text-medium text-center
              focus:outline-none focus:ring-2
              focus:ring-[var(--color-brand)]
              transition
            "
          />
        </div>
      </div>
    </div>
  );
}