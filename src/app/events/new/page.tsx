"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { eventService } from "@/services/event.service";
import { insertEventSchema } from "@/schemas/events";
import Link from "next/link";

export default function NewEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const rawData = {
            name: formData.get("name"),
            description: formData.get("description"),
            event_date: formData.get("event_date"),
            tickets: Number(formData.get("tickets")),
            creator: formData.get("creator"),
        };

        // Dentro da função handleSubmit no NewEventPage
        try {
            const validatedData = insertEventSchema.parse(rawData);
            const response = await eventService.create(validatedData);

            if (response.ok) {
                router.push("/");
                router.refresh();
            } else {
                setError(response.msg || "Erro ao criar evento");
            }
        } catch (err: unknown) {
            // Tratando o erro de forma segura sem 'any'
            if (err instanceof Error) {
                // Se for erro do Zod, ele costuma vir formatado em err.message ou err.errors
                try {
                    const zodError = JSON.parse(err.message);
                    setError(zodError[0]?.message || "Erro de validação");
                } catch {
                    setError(err.message);
                }
            } else {
                setError("Ocorreu um erro inesperado");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="container mx-auto max-w-2xl py-12 px-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-primary mb-6 block">
                ← Voltar para a Home
            </Link>

            <h1 className="text-3xl font-bold mb-8">Criar Novo Evento</h1>

            <form action={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border shadow-sm">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-2">Nome do Evento</label>
                    <input name="name" required className="w-full p-2 border rounded-md" placeholder="Ex: Workshop de React" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <textarea name="description" required className="w-full p-2 border rounded-md h-32" placeholder="O que vai rolar no evento?" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Data</label>
                        <input name="event_date" type="date" required className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Total de Ingressos</label>
                        <input name="tickets" type="number" required className="w-full p-2 border rounded-md" min="1" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Seu Nome (Creator)</label>
                    <input name="creator" required className="w-full p-2 border rounded-md" placeholder="Ex: Diego" />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition-all"
                >
                    {loading ? "Criando..." : "Publicar Evento"}
                </button>
            </form>
        </main>
    );
}