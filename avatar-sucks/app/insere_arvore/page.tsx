import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NovaArvore from '@/components/InsereArvore';

export default function ColoniaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Arvore</CardTitle>
      </CardHeader>
      <CardContent>
        <NovaArvore />
      </CardContent>
    </Card>
  );
}