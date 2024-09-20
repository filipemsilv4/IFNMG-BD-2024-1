// app/explorador/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TableSelector from '@/components/TableSelector';

export default function ExploradorPage() {
  return (
    <Card>
        <CardHeader>
        <CardTitle>Explorar Tabelas</CardTitle>
        </CardHeader>
        <CardContent>
        <TableSelector />
        </CardContent>
    </Card>
  );
}