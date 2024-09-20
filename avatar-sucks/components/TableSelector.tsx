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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

async function fetchPrimaryKeys(tableName: string) {
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      query: `
        SELECT column_name
        FROM all_cons_columns
        WHERE constraint_name = (
          SELECT constraint_name
          FROM all_constraints
          WHERE table_name = '${tableName}'
          AND constraint_type = 'P'
        )
      `
    }),
  });
  if (!response.ok) throw new Error('Falha ao buscar chaves primárias');
  return response.json();
}

async function removeRecord(tableName: string, primaryKeys: string[], primaryKeyValues: any[]) {
  const whereClause = primaryKeys.map((key, index) => `${key} = '${primaryKeyValues[index]}'`).join(' AND ');
  const response = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      query: `
        BEGIN
          DELETE FROM ${tableName} WHERE ${whereClause};
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
  const [primaryKeys, setPrimaryKeys] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [recordToRemove, setRecordToRemove] = useState<{ keys: string[], values: any[] } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTables()
      .then(data => setTables(data.rows.map((row: any) => row.TABLE_NAME)))
      .catch(err => setError('Erro ao carregar tabelas'));
  }, []);

  const handleTableSelect = async (tableName: string) => {
    setSelectedTable(tableName);
    setTableData(null);
    setPrimaryKeys([]);
    setError(null);

    try {
      const [tableDataResponse, primaryKeysResponse] = await Promise.all([
        fetchTableData(tableName),
        fetchPrimaryKeys(tableName)
      ]);

      setTableData(tableDataResponse);
      setPrimaryKeys(primaryKeysResponse.rows.map((row: any) => row.COLUMN_NAME));
    } catch (err) {
      setError(`Erro ao carregar dados da tabela ${tableName}: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleRemoveRecord = async () => {
    if (!selectedTable || !recordToRemove) return;
    try {
      await removeRecord(selectedTable, recordToRemove.keys, recordToRemove.values);
      toast({
        title: "Registro removido com sucesso",
        description: `O registro foi removido da tabela ${selectedTable}.`,
      });
      handleTableSelect(selectedTable); // Recarrega os dados da tabela
    } catch (err) {
      setError(`Erro ao remover registro: ${err instanceof Error ? err.message : String(err)}`);
      toast({
        title: "Erro ao remover registro",
        description: "Ocorreu um erro ao tentar remover o registro. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setRecordToRemove(null);
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        onClick={() => setRecordToRemove({ 
                          keys: primaryKeys, 
                          values: primaryKeys.map(key => row[key])
                        })}
                      >
                        Remover
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso removerá permanentemente o registro
                          e possíveis registros relacionados em outras tabelas (exclusão em cascata).
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setRecordToRemove(null)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRemoveRecord}>Continuar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}