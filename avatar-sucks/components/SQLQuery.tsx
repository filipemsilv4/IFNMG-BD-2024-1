import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import DynamicTable from './DynamicTable';

export default function SQLQuery() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ columns: string[], rows: Record<string, any>[] } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setResult(null);
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || 'Erro na consulta');
      }
      
      if (data.columns && data.rows) {
        setResult(data);
      } else if (data.rowsAffected !== undefined) {
        setMessage(`Operação concluída. Linhas afetadas: ${data.rowsAffected}`);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite sua consulta SQL aqui..."
          className="min-h-[100px]"
        />
        <Button type="submit">Executar Consulta</Button>
      </form>
      
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
      
      {result && (
        <DynamicTable 
          data={result} 
          caption="Resultado da Consulta"
        />
      )}
    </div>
  );
}