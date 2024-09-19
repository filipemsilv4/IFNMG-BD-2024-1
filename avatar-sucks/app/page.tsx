// app/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DatabaseGraph from '@/components/DatabaseGraph';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Bem-vindo à aplicação. Abaixo está o grafo de relações do banco de dados.</p>
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
    </div>
  );
}