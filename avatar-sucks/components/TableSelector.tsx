import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

async function fetchTables() {
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'SELECT table_name FROM user_tables' }),
  });
  if (!response.ok) throw new Error('Falha ao buscar tabelas');
  return response.json();
}

async function fetchTableData(tableName: string) {
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `SELECT * FROM ${tableName}` }),
  });
  if (!response.ok) throw new Error('Falha ao buscar dados da tabela');
  return response.json();
}

export default function TableSelector() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<{ columns: string[], rows: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTables()
      .then(data => setTables(data.rows.map((row: any) => row.TABLE_NAME)))
      .catch(err => setError('Erro ao carregar tabelas'));
  }, []);

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    setTableData(null);
    fetchTableData(tableName)
      .then(setTableData)
      .catch(err => setError(`Erro ao carregar dados da tabela ${tableName}`));
  };

  return (
    <div className="space-y-4">
      <Select onValueChange={handleTableSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione uma tabela" />
        </SelectTrigger>
        <SelectContent>
          {tables.map(table => (
            <SelectItem key={table} value={table}>{table}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-red-500">{error}</p>}

      {tableData && (
        <Table>
          <TableCaption>{selectedTable}</TableCaption>
          <TableHeader>
            <TableRow>
              {tableData.columns.map(column => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.rows.map((row, index) => (
              <TableRow key={index}>
                {tableData.columns.map(column => (
                  <TableCell key={column}>{row[column]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}