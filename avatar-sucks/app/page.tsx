'use client';
import SQLQuery from '@/components/SQLQuery';
import TableSelector from '@/components/TableSelector';

export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Consulta SQL Dinâmica</h1>
      <SQLQuery />
      <br />
      <TableSelector />
    </div>
  );
}