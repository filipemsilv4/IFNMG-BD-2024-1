"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

// Importações condicionais para evitar erros de SSR
let cytoscape: any;
let coseBilkent: any;
if (typeof window !== 'undefined') {
  cytoscape = require('cytoscape');
  coseBilkent = require('cytoscape-cose-bilkent');
  cytoscape.use(coseBilkent);
}

// Função para buscar relações do banco de dados
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

// Função para gerar elementos do Cytoscape a partir das relações do banco de dados
function generateCytoscapeElements(relations: any) {
  const nodes = new Set<string>();
  const edges: Array<{ data: { id: string; source: string; target: string; label: string } }> = [];

  relations.rows.forEach((relation: any) => {
    const { TABLE_NAME, COLUMN_NAME, PK_TABLE } = relation;
    nodes.add(TABLE_NAME);
    nodes.add(PK_TABLE);
    edges.push({
      data: {
        id: `${TABLE_NAME}-${PK_TABLE}`,
        source: TABLE_NAME,
        target: PK_TABLE,
        label: COLUMN_NAME
      }
    });
  });

  return [
    ...Array.from(nodes).map(table => ({ data: { id: table, label: table } })),
    ...edges
  ];
}

// Função para buscar os atributos de uma tabela
async function fetchTableAttributes(tableName: string) {
  const query = `
    SELECT column_name, data_type, data_length, nullable
    FROM user_tab_columns
    WHERE table_name = '${tableName}'
  `;

  const response = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Falha ao buscar atributos da tabela ${tableName}`);
  }
  return response.json();
}

export default function DatabaseGraph() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodeAttributes, setNodeAttributes] = useState<any[]>([]);
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(false);

  const loadGraph = async () => {
    if (!cytoscape) {
      setError("Cytoscape não está disponível");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const relations = await fetchDatabaseRelations();
      const elements = generateCytoscapeElements(relations);

      if (cyRef.current) {
        cyRef.current.destroy();
      }

      // Inicialização do Cytoscape
      cyRef.current = cytoscape({
        container: containerRef.current,
        elements: elements,
        style: [
          {
            selector: 'node',
            style: {
              'background-color': '#4299e1',
              'label': 'data(label)',
              'color': '#ffffff',
              'text-valign': 'center',
              'text-halign': 'center',
              'font-size': '12px',
              'font-weight': 'bold',
              'width': 'label',
              'height': 'label',
              'padding': '10px',
              'border-color': '#2b6cb0',
              'border-width': 2,
              'shape': 'roundrectangle'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2,
              'line-color': '#a0aec0',
              'target-arrow-color': '#a0aec0',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'font-size': '10px',
              'text-rotation': 'autorotate',
              'text-margin-y': -10,
              'edge-text-rotation': 'autorotate'
            }
          },
          {
            selector: 'node:active',
            style: {
              'background-color': '#2b6cb0',
              'border-color': '#2c5282',
              'border-width': 3,
            }
          }
        ],
        layout: {
          name: 'cose-bilkent',
          animate: true,
          animationDuration: 1000,
          nodeDimensionsIncludeLabels: true,
          fit: true,
          padding: 50,
          randomize: true,
          nodeRepulsion: 8000,
          idealEdgeLength: 150,
          edgeElasticity: 0.45,
          nestingFactor: 0.1,
          gravity: 0.25,
          numIter: 2500,
          tile: true,
          tilingPaddingVertical: 10,
          tilingPaddingHorizontal: 10,
          gravityRangeCompound: 1.5,
          gravityCompound: 1.0,
          gravityRange: 3.8,
          initialEnergyOnIncremental: 0.5
        }
      });

      // Evento de clique nos nós
      cyRef.current.on('tap', 'node', async function(evt: any){
        const node = evt.target;
        setSelectedNode(node);
        try {
          const attributes = await fetchTableAttributes(node.id());
          setNodeAttributes(attributes.rows);
        } catch (err: any) {
          console.error('Erro ao buscar atributos:', err);
          setError(`Erro ao buscar atributos da tabela: ${err.message}`);
        }
      });

      // Ajusta o zoom após o layout ser aplicado
      cyRef.current.on('layoutstop', function(){
        cyRef.current.fit();
      });

    } catch (err: any) {
      console.error('Erro detalhado:', err);
      setError(`Erro ao carregar o grafo do banco de dados: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNodeClick = async (node: any) => {
    setSelectedNode(node);
    setNodeAttributes([]);
    setIsLoadingAttributes(true);
    setError(null);
    try {
      const attributes = await fetchTableAttributes(node.id());
      setNodeAttributes(attributes.rows);
    } catch (err: any) {
      console.error('Erro ao buscar atributos:', err);
      setError(`Erro ao buscar atributos da tabela: ${err.message}`);
    } finally {
      setIsLoadingAttributes(false);
    }
  };

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.on('tap', 'node', function(evt: any) {
        handleNodeClick(evt.target);
      });
    }
    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <Button onClick={loadGraph} disabled={isLoading}>
        {isLoading ? 'Carregando...' : 'Carregar Grafo do Banco de Dados'}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      <div 
        ref={containerRef} 
        className="border border-gray-200 rounded-lg overflow-hidden h-[600px]"
      />
      <Dialog open={!!selectedNode} onOpenChange={(open) => {
        if (!open) {
          setSelectedNode(null);
          setNodeAttributes([]);
        }
      }}>
        <DialogContent className="sm:max-w-[700px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-4 text-gray-900">
              {selectedNode?.id()} - Atributos
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto">
            {isLoadingAttributes ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : nodeAttributes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] bg-gray-100">Coluna</TableHead>
                    <TableHead className="bg-gray-100">Tipo</TableHead>
                    <TableHead className="bg-gray-100">Tamanho</TableHead>
                    <TableHead className="bg-gray-100">Nulo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nodeAttributes.map((attr, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{attr.COLUMN_NAME}</TableCell>
                      <TableCell>{attr.DATA_TYPE}</TableCell>
                      <TableCell>{attr.DATA_LENGTH}</TableCell>
                      <TableCell>{attr.NULLABLE}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500">Nenhum atributo encontrado.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}