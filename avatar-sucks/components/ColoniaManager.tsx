"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import RowSelector from './RowSelector';

const formSchema = z.object({
  id_colonia: z.number().positive("ID deve ser um número positivo"),
  nome: z.string().min(1, "Nome é obrigatório"),
  apelido: z.string().min(1, "Apelido é obrigatório"),
  pressurizada: z.boolean(),
  id_jazida: z.number(),
  registro_empresa: z.string().max(8, "Registro da empresa deve ter 8 caracteres")
});

export default function NovaColonia() {
  const [selectedJazida, setSelectedJazida] = useState<any | null>(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState<any | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_colonia: 0,
      nome: "",
      apelido: "",
      pressurizada: false,
      id_jazida: 0,
      registro_empresa: ""
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Check if the ID already exists
      const checkResponse = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `SELECT COUNT(*) as count FROM colonia WHERE id_colonia = ${values.id_colonia}`
        }),
      });

      const checkData = await checkResponse.json();
      
      if (!checkResponse.ok) {
        throw new Error('Falha ao verificar ID da colônia');
      }

      if (checkData.rows[0].COUNT > 0) {
        form.setError('id_colonia', {
          type: 'manual',
          message: 'Este ID de colônia já existe. Por favor, escolha outro.'
        });
        return; // Stop the submission process here
      }

      // If ID doesn't exist, proceed with insertion
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            BEGIN
              INSERT INTO colonia (id_colonia, nome, apelido, pressurizada, id_jazida, registro_empresa)
              VALUES (${values.id_colonia}, '${values.nome}', '${values.apelido}', ${values.pressurizada ? 1 : 0}, ${values.id_jazida}, '${values.registro_empresa}');
              COMMIT;
            END;
          `
        }),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        console.error("Resposta da API não foi ok:", response.status, responseData);
        throw new Error(responseData.error || 'Falha ao cadastrar colônia');
      }
  
      console.log("Resposta da API:", responseData);
  
      toast({
        title: "Colônia cadastrada com sucesso!",
        description: `A colônia ${values.nome} foi cadastrada com o ID ${values.id_colonia}.`,
      });
  
      form.reset();
    } catch (error) {
      console.error("Erro ao cadastrar colônia:", error);
      toast({
        title: "Erro ao cadastrar colônia",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar cadastrar a colônia. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="id_colonia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID da Colônia</FormLabel>
              <FormControl>
                <Input type="number" placeholder="ID da Colônia" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Colônia</FormLabel>
              <FormControl>
                <Input placeholder="Nome da Colônia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apelido"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apelido da Colônia</FormLabel>
              <FormControl>
                <Input placeholder="Apelido da Colônia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pressurizada"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Pressurizada</FormLabel>
                <FormDescription>
                  A colônia é pressurizada?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <RowSelector
          tableName="JAZIDA"
          selectAttribute="ID_JAZIDA"
          onSelect={(jazida) => {
            setSelectedJazida(jazida);
            form.setValue('id_jazida', jazida.ID_JAZIDA);
          }}
          displayAttributes={["ID_JAZIDA", "QTD_RECURSOS", "ATIVA"]}
        />

        <RowSelector
          tableName="EMPRESA"
          selectAttribute="REGISTRO"
          onSelect={(empresa) => {
            setSelectedEmpresa(empresa);
            form.setValue('registro_empresa', empresa.REGISTRO);
          }}
        />

        <Button type="submit">Cadastrar Colônia</Button>
      </form>
    </Form>
  );
}