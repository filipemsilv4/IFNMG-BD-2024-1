'use client';
import { Suspense } from 'react';
import PessoaTable from '@/components/PessoaTable';

async function getPessoas() {
  const res = await fetch('http://localhost:3000/api/pessoas', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Falha ao buscar dados');
  }
  return res.json();
}

export default async function PessoasPage() {
  const pessoas = await getPessoas();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Lista de Pessoas</h1>
      <Suspense fallback={<div>Carregando...</div>}>
        <PessoaTable data={pessoas} />
      </Suspense>
    </div>
  );
}