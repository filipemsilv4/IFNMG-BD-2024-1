'use client';
import TableSelector from '@/components/TableSelector';
import DatabaseGraph from '@/components/DatabaseGraph';

export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Explorador de Banco de Dados</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">Seletor de Tabelas</h2>
          <TableSelector />
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3">Grafo de Relações do Banco de Dados</h2>
          <DatabaseGraph />
        </section>
      </div>
    </div>
  );
}