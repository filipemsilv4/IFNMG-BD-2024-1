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

const formSchema = z.object({
    id_colonia: z.number().positive("ID deve ser um número positivo"),
    nome: z.string().min(1, "Nome é obrigatório"),
    apelido: z.string().min(1, "Apelido é obrigatório"),
    pressurizada: z.boolean(),
    id_jazida: z.number(),
    registro_empresa: z.string().max(8, "Registro da empresa não deve exceder 8 caracteres")
});

type FormValues = z.infer<typeof formSchema>;

interface EditarColoniaProps {
    coloniaId: number;
}

export default function EditarColonia({ coloniaId }: EditarColoniaProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(true);
    const [currentJazida, setCurrentJazida] = useState<string | null>(null);
    const [currentEmpresa, setCurrentEmpresa] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id_colonia: coloniaId,
            nome: "",
            apelido: "",
            pressurizada: false,
            id_jazida: 0,
            registro_empresa: ""
        },
    });

    useEffect(() => {
        fetchColoniaData(coloniaId);
    }, [coloniaId]);

    const fetchColoniaData = async (id: number) => {
        try {
            const response = await fetch('/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
            SELECT c.*, j.QTD_RECURSOS, e.NOME as NOME_EMPRESA 
            FROM colonia c
            LEFT JOIN jazida j ON c.id_jazida = j.id_jazida
            LEFT JOIN empresa e ON c.registro_empresa = e.registro
            WHERE c.id_colonia = ${id}
          `
                }),
            });

            const data = await response.json();

            if (data.rows && data.rows.length > 0) {
                const colonia = data.rows[0];
                form.reset({
                    id_colonia: colonia.ID_COLONIA,
                    nome: colonia.NOME,
                    apelido: colonia.APELIDO,
                    pressurizada: colonia.PRESSURIZADA === 1,
                    id_jazida: colonia.ID_JAZIDA,
                    registro_empresa: colonia.REGISTRO_EMPRESA
                });
                setCurrentJazida(`ID: ${colonia.ID_JAZIDA} - Recursos: ${colonia.QTD_RECURSOS}`);
                setCurrentEmpresa(`${colonia.REGISTRO_EMPRESA} - ${colonia.NOME_EMPRESA}`);
            }
        } catch (error) {
            console.error("Erro ao buscar dados da colônia:", error);
            toast({
                title: "Erro ao carregar dados",
                description: "Não foi possível carregar os dados da colônia. Por favor, tente novamente.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    async function onSubmit(values: FormValues) {
        try {
            const oldValues = form.getValues();
            const response = await fetch('/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
            BEGIN
              UPDATE colonia
              SET nome = '${values.nome}',
                  apelido = '${values.apelido}',
                  pressurizada = ${values.pressurizada ? 1 : 0},
                  id_jazida = ${values.id_jazida},
                  registro_empresa = '${values.registro_empresa}'
              WHERE id_colonia = ${values.id_colonia};
              COMMIT;
            END;
          `
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error("Resposta da API não foi ok:", response.status, responseData);
                throw new Error(responseData.error || 'Falha ao atualizar colônia');
            }

            console.log("Resposta da API:", responseData);

            toast({
                title: "Colônia atualizada com sucesso!",
                description: `A colônia ${oldValues.nome} foi atualizada.`,
            });

            form.reset();

            // Recarrega os dados da colônia após a atualização
            fetchColoniaData(coloniaId);

        } catch (error) {
            console.error("Erro ao atualizar colônia:", error);
            toast({
                title: "Erro ao atualizar colônia",
                description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar atualizar a colônia. Por favor, tente novamente.",
                variant: "destructive",
            });
        }
    }

    if (loading) {
        return <div>Carregando...</div>;
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
                                <Input type="number" {...field} disabled />
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

                <div>
                    <p>Jazida atual: {currentJazida || 'Não definida'}</p>
                    <RowSelector
                        tableName="JAZIDA"
                        selectAttribute="ID_JAZIDA"
                        onSelect={(jazida) => form.setValue('id_jazida', jazida.ID_JAZIDA)}
                        displayAttributes={["ID_JAZIDA", "QTD_RECURSOS", "ATIVA"]}
                    />
                </div>

                <div>
                    <p>Empresa atual: {currentEmpresa || 'Não definida'}</p>
                    <RowSelector
                        tableName="EMPRESA"
                        selectAttribute="REGISTRO"
                        onSelect={(empresa) => form.setValue('registro_empresa', empresa.REGISTRO)}
                        displayAttributes={["NOME", "REGISTRO"]}
                    />
                </div>

                <Button type="submit">Atualizar Colônia</Button>
            </form>
        </Form>
    );
}