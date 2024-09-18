import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Select } from "../ui/select";
import { useEffect, useState } from "react";

type Jazida = {
    id_jazida: number;
};

async function fetchJazidas(): Promise<Jazida[]> {
    const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'SELECT id_jazida FROM Jazida' }),
    });
    if (!response.ok) throw new Error('Falha ao buscar jazidas');
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Resposta da API não é um array');
    return data;
}

export default function JazidaSelector() {
    const [jazidas, setJazidas] = useState<Jazida[]>([]);

    useEffect(() => {
        async function loadJazidas() {
            try {
                const data = await fetchJazidas();
                setJazidas(data);
            } catch (error) {
                console.error(error);
            }
        }
        loadJazidas();
    }, []);

    return (
        <div>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="SELECIONE UMA JAZIDA" />
                </SelectTrigger>
                <SelectContent>
                    {jazidas.map((jazida) => (
                        <SelectItem key={jazida.id_jazida} value={jazida.id_jazida.toString()}>
                            {jazida.id_jazida}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
