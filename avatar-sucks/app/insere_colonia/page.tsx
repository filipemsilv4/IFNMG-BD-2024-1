import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ColoniaTable from '@/components/InsereColonia';

export default function ColoniaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Colonia</CardTitle>
      </CardHeader>
      <CardContent>
        <ColoniaTable />
      </CardContent>
    </Card>
  );
}