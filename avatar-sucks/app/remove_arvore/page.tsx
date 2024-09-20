import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RemoveArvore from '@/components/RemoveArvore';

export default function ColoniaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Remove Arvore</CardTitle>
      </CardHeader>
      <CardContent>
        <RemoveArvore />
      </CardContent>
    </Card>
  );
}