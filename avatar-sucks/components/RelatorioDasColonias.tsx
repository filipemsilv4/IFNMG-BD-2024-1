"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Humano {
  NOME: string;
  TIPO: string;
}

interface Equipamento {
  NOME: string;
  UTILIDADE: string;
}

interface Container {
  NOME: string;
  TIPO: string;
  TAMANHO: string;
}

interface Maquinario {
  TIPO: string;
  MODELO: string;
}

interface Jazida {
  BASE: number;
  ALTURA: number;
  LATITUDE: number;
  LONGITUDE: number;
  ATIVA: boolean;
}

interface Colonia {
  ID_COLONIA: number;
  NOME: string;
  APELIDO: string;
  PRESSURIZADA: boolean;
  CONTAINERS: Container[];
  HUMANOS: Humano[];
  EQUIPAMENTOS: Equipamento[];
  JAZIDA: Jazida | null;
  MAQUINARIOS: Maquinario[];
}

export default function RelatorioColonias() {
  const [colonias, setColonias] = useState<Colonia[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRelatorioData();
  }, []);

  async function fetchRelatorioData() {
    try {
      const query = `
        SELECT 
          C.ID_COLONIA,
          C.NOME AS NOME_COLONIA,
          C.APELIDO,
          C.PRESSURIZADA,
          CONT.NOME AS NOME_CONTAINER,
          CONT.TIPO AS TIPO_CONTAINER,
          CONT.TAMANHO,
          H.NOME AS NOME_HUMANO,
          H.TIPO AS TIPO_HUMANO,
          COALESCE(CI.ESPECIALIDADE, MI.ESPECIALIDADE, ME.FUNCAO) AS ESPECIALIDADE_HUMANO,
          E.NOME AS NOME_EQUIPAMENTO,
          E.UTILIDADE,
          J.BASE,
          J.ALTURA,
          J.LATITUDE,
          J.LONGITUDE,
          J.ATIVA,
          M.TIPO AS TIPO_MAQUINARIO,
          M.MODELO
        FROM 
          COLONIA C
          LEFT JOIN CONTAINER CONT ON C.ID_COLONIA = CONT.ID_COLONIA
          LEFT JOIN HUMANO H ON C.ID_COLONIA = H.ID_COLONIA
          LEFT JOIN CIENTISTA CI ON H.ID_HUMANO = CI.ID_HUMANO
          LEFT JOIN MILITAR MI ON H.ID_HUMANO = MI.ID_HUMANO
          LEFT JOIN MINERADOR ME ON H.ID_HUMANO = ME.ID_HUMANO
          LEFT JOIN LABORATORIO L ON CONT.ID_CONTAINER = L.ID_CONTAINER
          LEFT JOIN EMPREGA_CIENTISTA EC ON L.ID_LABORATORIO = EC.ID_LABORATORIO AND CI.ID_CIENTISTA = EC.ID_CIENTISTA
          LEFT JOIN DESENVOLVE D ON EC.ID_LABORATORIO = D.ID_LABORATORIO AND EC.ID_CIENTISTA = D.ID_CIENTISTA
          LEFT JOIN UTILIZA U ON D.ID_PESQUISA = U.ID_PESQUISA
          LEFT JOIN EQUIPAMENTO E ON U.ID_EQUIPAMENTO = E.ID_EQUIPAMENTO
          LEFT JOIN JAZIDA J ON C.ID_JAZIDA = J.ID_JAZIDA
          LEFT JOIN MAQUINARIO M ON J.ID_JAZIDA = M.ID_JAZIDA
        ORDER BY 
          C.ID_COLONIA, CONT.ID_CONTAINER, H.ID_HUMANO, E.ID_EQUIPAMENTO, M.ID_MAQUINARIO
      `;

      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar dados do relatório');
      }

      const data = await response.json();
      const coloniasMapeadas = mapearDadosColonias(data.rows);
      setColonias(coloniasMapeadas);
    } catch (error) {
      console.error("Erro ao buscar dados do relatório:", error);
      toast({
        title: "Erro ao carregar relatório",
        description: "Não foi possível carregar os dados do relatório. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function mapearDadosColonias(rows: any[]): Colonia[] {
    const coloniaMap = new Map<number, Colonia>();

    rows.forEach(row => {
      if (!coloniaMap.has(row.ID_COLONIA)) {
        coloniaMap.set(row.ID_COLONIA, {
          ID_COLONIA: row.ID_COLONIA,
          NOME: row.NOME_COLONIA,
          APELIDO: row.APELIDO,
          PRESSURIZADA: row.PRESSURIZADA === 1,
          CONTAINERS: [],
          HUMANOS: [],
          EQUIPAMENTOS: [],
          JAZIDA: row.BASE ? {
            BASE: row.BASE,
            ALTURA: row.ALTURA,
            LATITUDE: row.LATITUDE,
            LONGITUDE: row.LONGITUDE,
            ATIVA: row.ATIVA === 1
          } : null,
          MAQUINARIOS: []
        });
      }

      const colonia = coloniaMap.get(row.ID_COLONIA)!;

      if (row.NOME_CONTAINER && !colonia.CONTAINERS.some(c => c.NOME === row.NOME_CONTAINER)) {
        colonia.CONTAINERS.push({
          NOME: row.NOME_CONTAINER,
          TIPO: row.TIPO_CONTAINER,
          TAMANHO: row.TAMANHO
        });
      }

      if (row.NOME_HUMANO && !colonia.HUMANOS.some(h => h.NOME === row.NOME_HUMANO)) {
        colonia.HUMANOS.push({
          NOME: row.NOME_HUMANO,
          TIPO: row.TIPO_HUMANO
        });
      }

      if (row.NOME_EQUIPAMENTO && !colonia.EQUIPAMENTOS.some(e => e.NOME === row.NOME_EQUIPAMENTO)) {
        colonia.EQUIPAMENTOS.push({
          NOME: row.NOME_EQUIPAMENTO,
          UTILIDADE: row.UTILIDADE
        });
      }

      if (row.TIPO_MAQUINARIO && !colonia.MAQUINARIOS.some(m => m.TIPO === row.TIPO_MAQUINARIO && m.MODELO === row.MODELO)) {
        colonia.MAQUINARIOS.push({
          TIPO: row.TIPO_MAQUINARIO,
          MODELO: row.MODELO
        });
      }
    });

    return Array.from(coloniaMap.values());
  }

  if (loading) {
    return <div>Carregando relatório...</div>;
  }

  return (
    <div className="space-y-6">
      {colonias.map((colonia) => (
        <Card key={colonia.ID_COLONIA}>
          <CardHeader>
            <CardTitle>{colonia.NOME}</CardTitle>
            <CardDescription>
              Apelido: {colonia.APELIDO} |
              Pressurizada: <Badge variant={colonia.PRESSURIZADA ? "default" : "secondary"}>
                {colonia.PRESSURIZADA ? "Sim" : "Não"}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="containers">
                <AccordionTrigger>Containers ({colonia.CONTAINERS.length})</AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Tamanho</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {colonia.CONTAINERS.map((container, index) => (
                        <TableRow key={index}>
                          <TableCell>{container.NOME}</TableCell>
                          <TableCell>{container.TIPO}</TableCell>
                          <TableCell>{container.TAMANHO}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="humanos">
                <AccordionTrigger>Humanos ({colonia.HUMANOS.length})</AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {colonia.HUMANOS.map((humano, index) => (
                        <TableRow key={index}>
                          <TableCell>{humano.NOME}</TableCell>
                          <TableCell>{humano.TIPO}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="equipamentos">
                <AccordionTrigger>Equipamentos ({colonia.EQUIPAMENTOS.length})</AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Utilidade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {colonia.EQUIPAMENTOS.map((equipamento, index) => (
                        <TableRow key={index}>
                          <TableCell>{equipamento.NOME}</TableCell>
                          <TableCell>{equipamento.UTILIDADE}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>

              {colonia.JAZIDA && (
                <AccordionItem value="jazida">
                  <AccordionTrigger>Jazida</AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Base</TableCell>
                          <TableCell>{colonia.JAZIDA.BASE}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Altura</TableCell>
                          <TableCell>{colonia.JAZIDA.ALTURA}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Latitude</TableCell>
                          <TableCell>{colonia.JAZIDA.LATITUDE}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Longitude</TableCell>
                          <TableCell>{colonia.JAZIDA.LONGITUDE}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Ativa</TableCell>
                          <TableCell>
                            <Badge variant={colonia.JAZIDA.ATIVA ? "default" : "secondary"}>
                              {colonia.JAZIDA.ATIVA ? "Sim" : "Não"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              )}

              {colonia.MAQUINARIOS.length > 0 && (
                <AccordionItem value="maquinarios">
                  <AccordionTrigger>Maquinários ({colonia.MAQUINARIOS.length})</AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Modelo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {colonia.MAQUINARIOS.map((maquinario, index) => (
                          <TableRow key={index}>
                            <TableCell>{maquinario.TIPO}</TableCell>
                            <TableCell>{maquinario.MODELO}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
