import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RelatorioColonias from '@/components/RelatorioDasColonias';

export default function RelatorioPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório das Colônias</CardTitle>
      </CardHeader>
      <CardContent>
        <RelatorioColonias />
      </CardContent>
    </Card>
  );
}