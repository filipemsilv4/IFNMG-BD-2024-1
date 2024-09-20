"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EditarColonia from '@/components/EditaColonia';
import RowSelector from '@/components/RowSelector';
import { Button } from "@/components/ui/button";

export default function ColoniaPage() {
  const [selectedColonia, setSelectedColonia] = useState<{ ID_COLONIA: number } | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleColoniaSelect = (colonia: { ID_COLONIA: number }) => {
    setSelectedColonia(colonia);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Colônia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RowSelector
            tableName="COLONIA"
            selectAttribute="ID_COLONIA"
            onSelect={handleColoniaSelect}
            displayAttributes={["ID_COLONIA", "NOME", "APELIDO"]}
          />
          
          {selectedColonia && !isEditing && (
            <Button onClick={handleEditClick}>Editar Colônia Selecionada</Button>
          )}

          {isEditing && selectedColonia && (
            <EditarColonia coloniaId={selectedColonia.ID_COLONIA} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}