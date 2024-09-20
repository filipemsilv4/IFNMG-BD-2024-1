"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  id_arvore: z.string().min(1, "Selecione uma árvore para remover"),
});

type Arvore = {
  ID_ARVORE: number;
  TIPO: string;
  IDADE: number;
  ALTURA: number;
};

export default function RemoveArvore() {
  const { toast } = useToast()
  const [arvores, setArvores] = useState<Arvore[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_arvore: "",
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
            SELECT a.ID_ARVORE, a.TIPO, a.IDADE, a.ALTURA
            FROM ARVORE a
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
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const query = `
        DECLARE
          v_tipo VARCHAR2(50);
        BEGIN
          -- Obter o tipo da árvore
          SELECT TIPO INTO v_tipo FROM ARVORE WHERE ID_ARVORE = ${values.id_arvore};
          
          -- Remover da tabela específica
          CASE v_tipo
            WHEN 'Vida' THEN DELETE FROM ARVORE_VIDA WHERE ID_ARVORE = ${values.id_arvore};
            WHEN 'Lar' THEN DELETE FROM ARVORE_LAR WHERE ID_ARVORE = ${values.id_arvore};
            WHEN 'Alma' THEN DELETE FROM ARVORE_ALMA WHERE ID_ARVORE = ${values.id_arvore};
          END CASE;
          
          -- Remover da tabela geral
          DELETE FROM ARVORE WHERE ID_ARVORE = ${values.id_arvore};
          
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
        throw new Error('Falha ao remover árvore');
      }

      toast({
        title: "Árvore removida com sucesso!",
        description: `A árvore foi removida do sistema.`,
      });

      form.reset();
      fetchArvores(); // Atualiza a lista de árvores após a remoção
    } catch (error) {
      console.error("Erro ao remover árvore:", error);
      toast({
        title: "Erro ao remover árvore",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar remover a árvore. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="id_arvore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selecione a Árvore para Remover</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <Button type="submit">Remover Árvore</Button>
      </form>
    </Form>
  );
}