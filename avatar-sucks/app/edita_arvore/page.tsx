import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EditaArvore from '@/components/EditaArvore';

export default function ColoniaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Árvore</CardTitle>
      </CardHeader>
      <CardContent>
        <EditaArvore />
      </CardContent>
    </Card>
  );
}