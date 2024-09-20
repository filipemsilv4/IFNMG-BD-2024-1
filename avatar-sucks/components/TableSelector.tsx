"use client";
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
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

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

async function removeRecord(tableName: string, primaryKey: string, primaryKeyValue: any) {
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      query: `
        BEGIN
          DELETE FROM ${tableName} WHERE ${primaryKey} = '${primaryKeyValue}';
          COMMIT;
        END;
      `
    }),
  });
  if (!response.ok) throw new Error('Falha ao remover o registro');
  return response.json();
}

export default function TableSelector() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<{ columns: string[], rows: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTables()
      .then(data => setTables(data.rows.map((row: any) => row.TABLE_NAME)))
      .catch(err => setError('Erro ao carregar tabelas'));
  }, []);

  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    setTableData(null);
    loadTableData(tableName);
  };

  const loadTableData = (tableName: string) => {
    fetchTableData(tableName)
      .then(setTableData)
      .catch(err => setError(`Erro ao carregar dados da tabela ${tableName}`));
  };

  const handleRemoveRecord = async (primaryKey: string, primaryKeyValue: any) => {
    if (!selectedTable) return;
    try {
      await removeRecord(selectedTable, primaryKey, primaryKeyValue);
      toast({
        title: "Registro removido com sucesso",
        description: `O registro foi removido da tabela ${selectedTable}.`,
      });
      loadTableData(selectedTable); // Recarrega os dados da tabela
    } catch (err) {
      setError(`Erro ao remover registro: ${err instanceof Error ? err.message : String(err)}`);
      toast({
        title: "Erro ao remover registro",
        description: "Ocorreu um erro ao tentar remover o registro. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Toaster />
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
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.rows.map((row, index) => (
              <TableRow key={index}>
                {tableData.columns.map(column => (
                  <TableCell key={column}>{row[column]}</TableCell>
                ))}
                <TableCell>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleRemoveRecord(tableData.columns[0], row[tableData.columns[0]])}
                  >
                    Remover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}