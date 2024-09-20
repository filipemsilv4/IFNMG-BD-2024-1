import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RemoveArvore from '@/components/RemoveArvore';

export default function ColoniaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Remover Árvore</CardTitle>
      </CardHeader>
      <CardContent>
        <RemoveArvore />
      </CardContent>
    </Card>
  );
}