'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import TableSelector from '@/components/TableSelector';
import DatabaseGraph from '@/components/DatabaseGraph';
import ColoniaTable from '@/components/ColoniaManager';

export default function HomePage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Colonia</CardTitle>
        </CardHeader>
        <CardContent>
          <ColoniaTable />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Explorador de Banco de Dados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Seletor de Tabelas</CardTitle>
            </CardHeader>
            <CardContent>
              <TableSelector />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grafo de Relações do Banco de Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <DatabaseGraph />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}