"use client";
"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RowSelector from './RowSelector';

const baseSchema = z.object({
  ID_ARVORE: z.string().min(1, "Selecione uma árvore para editar"),
  IDADE: z.number().min(0, "Idade deve ser um número positivo"),
  ALTURA: z.number().min(0, "Altura deve ser um número positivo"),
  ID_REGIAO: z.number(),
});

const vidaSchema = baseSchema.extend({
  TIPO: z.literal("VIDA"),
  PRODUZ_SEMENTES: z.boolean(),
});

const larSchema = baseSchema.extend({
  TIPO: z.literal("LAR"),
  CAPACIDADE: z.number().min(0, "Capacidade deve ser um número positivo"),
  HABITANTES: z.number().min(0, "Número de habitantes deve ser um número positivo"),
});

const almaSchema = baseSchema.extend({
  TIPO: z.literal("ALMA"),
  EYWA: z.boolean(),
});

const formSchema = z.discriminatedUnion("TIPO", [
  vidaSchema,
  larSchema,
  almaSchema,
]);

type FormSchema = z.infer<typeof formSchema>;

type ArvoreBase = {
  ID_ARVORE: number;
  TIPO: "VIDA" | "LAR" | "ALMA";
  IDADE: number;
  ALTURA: number;
  ID_REGIAO: number;
};

type ArvoreVida = ArvoreBase & {
  TIPO: "VIDA";
  PRODUZ_SEMENTES: number;
};

type ArvoreLar = ArvoreBase & {
  TIPO: "LAR";
  CAPACIDADE: number;
  HABITANTES: number;
};

type ArvoreAlma = ArvoreBase & {
  TIPO: "ALMA";
  EYWA: number;
};

type Arvore = ArvoreVida | ArvoreLar | ArvoreAlma;

export default function EditaArvore() {
  const { toast } = useToast()
  const [arvores, setArvores] = useState<ArvoreBase[]>([]);
  const [selectedArvore, setSelectedArvore] = useState<Arvore | null>(null);
  const [currentRegiao, setCurrentRegiao] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ID_ARVORE: "",
      TIPO: "VIDA",
      IDADE: 0,
      ALTURA: 0,
      ID_REGIAO: 0,
      PRODUZ_SEMENTES: false,
    },
  });

  useEffect(() => {
    fetchArvores();
  }, []);

  async function fetchArvores() {
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            SELECT A.ID_ARVORE, A.TIPO, A.IDADE, A.ALTURA, A.ID_REGIAO, R.NOME AS NOME_REGIAO, R.TIPO AS TIPO_REGIAO
            FROM ARVORE A
            LEFT JOIN REGIAO R ON A.ID_REGIAO = R.ID_REGIAO
          `
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar árvores');
      }

      const data = await response.json();
      setArvores(data.rows);
    } catch (error) {
      console.error("Erro ao buscar árvores:", error);
      toast({
        title: "Erro ao buscar árvores",
        description: "Não foi possível carregar a lista de árvores. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchArvoreDetails(id: string) {
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            SELECT A.*, 
                   AV.PRODUZ_SEMENTES,
                   AL.CAPACIDADE, AL.HABITANTES,
                   AA.EYWA,
                   R.NOME AS NOME_REGIAO, R.TIPO AS TIPO_REGIAO
            FROM ARVORE A
            LEFT JOIN ARVORE_VIDA AV ON A.ID_ARVORE = AV.ID_ARVORE
            LEFT JOIN ARVORE_LAR AL ON A.ID_ARVORE = AL.ID_ARVORE
            LEFT JOIN ARVORE_ALMA AA ON A.ID_ARVORE = AA.ID_ARVORE
            LEFT JOIN REGIAO R ON A.ID_REGIAO = R.ID_REGIAO
            WHERE A.ID_ARVORE = ${id}
          `
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar detalhes da árvore');
      }

      const data = await response.json();
      const arvoreDetails = data.rows[0] as Arvore;
      
      const baseValues = {
        ID_ARVORE: id,
        TIPO: arvoreDetails.TIPO,
        IDADE: arvoreDetails.IDADE,
        ALTURA: arvoreDetails.ALTURA,
        ID_REGIAO: arvoreDetails.ID_REGIAO,
      };

      let specificValues;
      switch (arvoreDetails.TIPO) {
        case "VIDA":
          specificValues = {
            PRODUZ_SEMENTES: (arvoreDetails as ArvoreVida).PRODUZ_SEMENTES === 1,
          };
          break;
        case "LAR":
          specificValues = {
            CAPACIDADE: (arvoreDetails as ArvoreLar).CAPACIDADE,
            HABITANTES: (arvoreDetails as ArvoreLar).HABITANTES,
          };
          break;
        case "ALMA":
          specificValues = {
            EYWA: (arvoreDetails as ArvoreAlma).EYWA === 1,
          };
          break;
      }

      form.reset({ ...baseValues, ...specificValues } as FormSchema);

      setSelectedArvore(arvoreDetails);
      setCurrentRegiao(`ID: ${arvoreDetails.ID_REGIAO} - Nome: ${arvoreDetails.NOME_REGIAO} - Tipo: ${arvoreDetails.TIPO_REGIAO}`);
    } catch (error) {
      console.error("Erro ao buscar detalhes da árvore:", error);
      toast({
        title: "Erro ao buscar detalhes da árvore",
        description: "Não foi possível carregar os detalhes da árvore selecionada. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }

  async function onSubmit(values: FormSchema) {
    try {
      let query = `
        DECLARE
          V_TIPO VARCHAR2(50);
        BEGIN
          UPDATE ARVORE
          SET IDADE = ${values.IDADE},
              ALTURA = ${values.ALTURA},
              ID_REGIAO = ${values.ID_REGIAO}
          WHERE ID_ARVORE = ${values.ID_ARVORE};
          
          SELECT TIPO INTO V_TIPO FROM ARVORE WHERE ID_ARVORE = ${values.ID_ARVORE};
          
          CASE V_TIPO
            WHEN 'VIDA' THEN 
              UPDATE ARVORE_VIDA
              SET PRODUZ_SEMENTES = ${values.TIPO === "VIDA" ? (values.PRODUZ_SEMENTES ? 1 : 0) : 0}
              WHERE ID_ARVORE = ${values.ID_ARVORE};
            WHEN 'LAR' THEN 
              UPDATE ARVORE_LAR
              SET CAPACIDADE = ${values.TIPO === "LAR" ? values.CAPACIDADE : 0},
                  HABITANTES = ${values.TIPO === "LAR" ? values.HABITANTES : 0}
              WHERE ID_ARVORE = ${values.ID_ARVORE};
            WHEN 'ALMA' THEN 
              UPDATE ARVORE_ALMA
              SET EYWA = ${values.TIPO === "ALMA" ? (values.EYWA ? 1 : 0) : 0}
              WHERE ID_ARVORE = ${values.ID_ARVORE};
          END CASE;
          
          COMMIT;
        EXCEPTION
          WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
        END;
      `;

      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar árvore');
      }

      toast({
        title: "Árvore atualizada com sucesso!",
        description: `A árvore foi atualizada no sistema.`,
      });

      form.reset({
        ID_ARVORE: "",
        TIPO: "VIDA",
        IDADE: 0,
        ALTURA: 0,
        ID_REGIAO: 0,
        PRODUZ_SEMENTES: false,
      });
      setSelectedArvore(null);
      setCurrentRegiao(null);

      fetchArvores(); // Atualiza a lista de árvores após a edição
    } catch (error) {
      console.error("Erro ao atualizar árvore:", error);
      toast({
        title: "Erro ao atualizar árvore",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar atualizar a árvore. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }

  const tipoArvore = form.watch("TIPO");

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="ID_ARVORE"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selecione a Árvore para Editar</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  fetchArvoreDetails(value);
                }} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma árvore" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {arvores.map((arvore) => (
                    <SelectItem key={arvore.ID_ARVORE} value={arvore.ID_ARVORE.toString()}>
                      {`ID: ${arvore.ID_ARVORE} - Tipo: ${arvore.TIPO} - Idade: ${arvore.IDADE} - Altura: ${arvore.ALTURA}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedArvore && (
          <>
            <FormField
              control={form.control}
              name="IDADE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idade</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ALTURA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altura</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <p>Região atual: {currentRegiao || 'Não definida'}</p>
              <RowSelector
                tableName="REGIAO"
                selectAttribute="ID_REGIAO"
                onSelect={(regiao) => {
                  form.setValue('ID_REGIAO', regiao.ID_REGIAO);
                  setCurrentRegiao(`ID: ${regiao.ID_REGIAO} - Nome: ${regiao.NOME} - Tipo: ${regiao.TIPO}`);
                }}
                displayAttributes={["ID_REGIAO", "NOME", "TIPO"]}
              />
            </div>

            {tipoArvore === "VIDA" && (
              <FormField
                control={form.control}
                name="PRODUZ_SEMENTES"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Produz Sementes</FormLabel>
                      <FormDescription>
                        A árvore da vida produz sementes?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

            {tipoArvore === "LAR" && (
              <>
                <FormField
                  control={form.control}
                  name="CAPACIDADE"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidade</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="HABITANTES"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Habitantes</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {tipoArvore === "ALMA" && (
              <FormField
                control={form.control}
                name="EYWA"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Conectada a Eywa</FormLabel>
                      <FormDescription>
                        A árvore da alma está conectada a Eywa?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            )}

            <Button type="submit">Atualizar Árvore</Button>
          </>
        )}
      </form>
    </Form>
  );
}