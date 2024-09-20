"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast"
import RowSelector from './RowSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const baseSchema = z.object({
  idade: z.number().min(0, "Idade deve ser um número positivo"),
  altura: z.number().min(0, "Altura deve ser um número positivo"),
  id_regiao: z.number(),
});

const vidaSchema = baseSchema.extend({
  tipo: z.literal("Vida"),
  produz_sementes: z.boolean(),
});

const larSchema = baseSchema.extend({
  tipo: z.literal("Lar"),
  capacidade: z.number().min(0, "Capacidade deve ser um número positivo"),
  habitantes: z.number().min(0, "Número de habitantes deve ser um número positivo"),
});

const almaSchema = baseSchema.extend({
  tipo: z.literal("Alma"),
  eywa: z.boolean(),
});

const formSchema = z.discriminatedUnion("tipo", [
  vidaSchema,
  larSchema,
  almaSchema,
]);

type FormSchema = z.infer<typeof formSchema>;

export default function NovaArvore() {
  const { toast } = useToast()
  const [selectedRegiao, setSelectedRegiao] = useState<any | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "Vida",
      idade: 0,
      altura: 0,
      id_regiao: 0,
      produz_sementes: false,
    },
  });

  const tipoArvore = form.watch("tipo");

  async function onSubmit(values: FormSchema) {
    try {
      let query = `
        DECLARE
          v_id_arvore NUMBER;
        BEGIN
          INSERT INTO arvore (tipo, idade, altura, id_regiao)
          VALUES ('${values.tipo}', ${values.idade}, ${values.altura}, ${values.id_regiao})
          RETURNING id_arvore INTO v_id_arvore;
      `;

      switch (values.tipo) {
        case "Vida":
          query += `
            INSERT INTO arvore_vida (id_arvore, produz_sementes)
            VALUES (v_id_arvore, ${values.produz_sementes ? 1 : 0});
          `;
          break;
        case "Lar":
          query += `
            INSERT INTO arvore_lar (id_arvore, capacidade, habitantes)
            VALUES (v_id_arvore, ${values.capacidade}, ${values.habitantes});
          `;
          break;
        case "Alma":
          query += `
            INSERT INTO arvore_alma (id_arvore, eywa)
            VALUES (v_id_arvore, ${values.eywa ? 1 : 0});
          `;
          break;
      }

      query += `
        COMMIT;
      END;
      `;

      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Falha ao cadastrar árvore');
      }

      toast({
        title: "Árvore cadastrada com sucesso!",
        description: `A árvore do tipo ${values.tipo} foi cadastrada.`,
      });

      form.reset();
    } catch (error) {
      console.error("Erro ao cadastrar árvore:", error);
      toast({
        title: "Erro ao cadastrar árvore",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar cadastrar a árvore. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Árvore</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de árvore" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Vida">Árvore da Vida</SelectItem>
                  <SelectItem value="Lar">Árvore-Lar</SelectItem>
                  <SelectItem value="Alma">Árvore da Alma</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idade"
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
          name="altura"
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

        <RowSelector
          tableName="REGIAO"
          selectAttribute="ID_REGIAO"
          onSelect={(regiao) => {
            setSelectedRegiao(regiao);
            form.setValue('id_regiao', regiao.ID_REGIAO);
          }}
          displayAttributes={["ID_REGIAO", "NOME", "TIPO"]}
        />

        {tipoArvore === "Vida" && (
          <FormField
            control={form.control}
            name="produz_sementes"
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

        {tipoArvore === "Lar" && (
          <>
            <FormField
              control={form.control}
              name="capacidade"
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
              name="habitantes"
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

        {tipoArvore === "Alma" && (
          <FormField
            control={form.control}
            name="eywa"
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

        <Button type="submit">Cadastrar Árvore</Button>
      </form>
    </Form>
  );
}