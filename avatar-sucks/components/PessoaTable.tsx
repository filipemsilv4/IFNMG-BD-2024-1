import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table"

interface Pessoa {
  CPF: string;
  tipopessoa: string;
  datanascimento: string;
  nome: string;
  CEP: string;
  bairro: string;
  numero: number;
  rua: string;
}

const columns: ColumnDef<Pessoa>[] = [
  {
    accessorKey: "CPF",
    header: "CPF",
  },
  {
    accessorKey: "NOME",
    header: "Nome",
  },
  {
    accessorKey: "TIPOPESSOA",
    header: "Tipo de Pessoa",
  },
  {
    accessorKey: "DATANASCIMENTO",
    header: "Data de Nascimento",
  },
  {
    accessorKey: "CEP",
    header: "CEP",
  },
  {
    accessorKey: "BAIRRO",
    header: "Bairro",
  },
  {
    accessorKey: "NUMERO",
    header: "Número",
  },
  {
    accessorKey: "RUA",
    header: "Rua",
  },
];

export default function PessoaTable({ data }: { data: Pessoa[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table>
      <TableCaption>Lista de Pessoas</TableCaption>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              Sem resultados.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}