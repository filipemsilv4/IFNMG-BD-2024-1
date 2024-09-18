import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import mermaid from 'mermaid';

async function fetchDatabaseRelations() {
  const query = `
    SELECT
      a.table_name as table_name,
      a.column_name as column_name,
      c_pk.table_name as pk_table,
      a.constraint_name as constraint_name
    FROM
      user_cons_columns a
    JOIN user_constraints c ON a.constraint_name = c.constraint_name
    JOIN user_constraints c_pk ON c.r_constraint_name = c_pk.constraint_name
    WHERE
      c.constraint_type = 'R'
  `;

  const response = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Falha ao buscar relações do banco de dados: ${errorData.error || response.statusText}`);
  }
  return response.json();
}

function generateMermaidDiagram(relations: { rows: any[]; }) {
  let mermaidCode = 'erDiagram\n';
  const tables = new Set();

  relations.rows.forEach((relation: { TABLE_NAME: any; COLUMN_NAME: any; PK_TABLE: any; }) => {
    const { TABLE_NAME, COLUMN_NAME, PK_TABLE } = relation;
    tables.add(TABLE_NAME);
    tables.add(PK_TABLE);
    mermaidCode += `    ${PK_TABLE} ||--o{ ${TABLE_NAME} : "${COLUMN_NAME}"\n`;
  });

  tables.forEach(table => {
    mermaidCode += `    ${table} {\n    }\n`;
  });

  return mermaidCode;
}

export default function DatabaseGraph() {
  const [mermaidGraph, setMermaidGraph] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
  }, []);

  const loadGraph = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const relations = await fetchDatabaseRelations();
      console.log('Relações recebidas:', relations); // Log para debug
      const diagram = generateMermaidDiagram(relations);
      console.log('Diagrama gerado:', diagram); // Log para debug
      setMermaidGraph(diagram);
    } catch (err) {
      console.error('Erro detalhado:', err);
      if (err instanceof Error) {
        setError(`Erro ao carregar o grafo do banco de dados: ${err.message}`);
      } else {
        setError('Erro ao carregar o grafo do banco de dados: erro desconhecido');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mermaidGraph) {
      mermaid.contentLoaded();
    }
  }, [mermaidGraph]);

  return (
    <div className="space-y-4">
      <Button onClick={loadGraph} disabled={isLoading}>
        {isLoading ? 'Carregando...' : 'Carregar Grafo do Banco de Dados'}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      {mermaidGraph && (
        <div className="mermaid">
          {mermaidGraph}
        </div>
      )}
    </div>
  );
}