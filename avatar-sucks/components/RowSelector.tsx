import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RowSelectorProps {
  tableName: string;
  selectAttribute: string;
  onSelect: (selectedRow: any) => void;
  displayAttributes?: string[];
}

async function fetchRowsFromTable(tableName: string, selectAttribute: string) {
  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `SELECT * FROM ${tableName}` }),
    });

    if (!response.ok) throw new Error(`Falha ao buscar dados da tabela ${tableName}`);
    
    const data = await response.json();
    
    if (!data || !data.rows) throw new Error('Resposta inválida da API');
    
    return data.rows;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw new Error(`Erro ao carregar dados da tabela ${tableName}`);
  }
}

export default function RowSelector({ tableName, selectAttribute, onSelect, displayAttributes = [] }: RowSelectorProps) {
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetchRowsFromTable(tableName, selectAttribute)
      .then((data) => {
        if (Array.isArray(data)) {
          setRows(data);
        } else {
          setError('Dados inválidos recebidos.');
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [tableName, selectAttribute]);

  const handleRowSelect = (value: string) => {
    const selectedRow = rows.find((row) => {
      return row[selectAttribute] !== undefined && row[selectAttribute]?.toString() === value;
    });
    if (selectedRow) {
      onSelect(selectedRow);
    }
  };

  const getDisplayText = (row: any) => {
    if (displayAttributes.length === 0) {
      return `ID: ${row[selectAttribute]}`;
    }
    return displayAttributes.map(attr => `${attr}: ${row[attr] ?? 'N/A'}`).join(' - ');
  };

  if (loading) {
    return <p>Carregando dados...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!rows || rows.length === 0) {
    return <p>Nenhum dado disponível para seleção.</p>;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="row-select">{`Selecione por ${selectAttribute}`}</Label>
      <Select onValueChange={handleRowSelect}>
        <SelectTrigger id="row-select" className="w-[300px]">
          <SelectValue placeholder={`Selecione um ${selectAttribute}`} />
        </SelectTrigger>
        <SelectContent>
          {rows.map((row, index) => {
            const value = row[selectAttribute];

            if (value !== undefined && value !== null) {
              return (
                <SelectItem key={index} value={value.toString()}>
                  {getDisplayText(row)}
                </SelectItem>
              );
            }

            return null;
          })}
        </SelectContent>
      </Select>
    </div>
  );
}