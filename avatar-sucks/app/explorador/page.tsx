// app/explorador/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TableSelector from '@/components/TableSelector';

export default function ExploradorPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Explorador de Banco de Dados</CardTitle>
      </CardHeader>
      <CardContent>
        <Card>
          <CardHeader>
            <CardTitle>Seletor de Tabelas</CardTitle>
          </CardHeader>
          <CardContent>
            <TableSelector />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}