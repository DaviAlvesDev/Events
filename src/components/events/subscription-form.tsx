"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Importe o router
import { subscriptionService } from "@/services/subscription.service";

export function SubscriptionForm({ eventId }: { eventId: string }) {
    const router = useRouter(); // Inicialize o router
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleSubscribe(formData: FormData) {
        setLoading(true);
        setMessage(null);

        const buyer = formData.get("buyer") as string;

        const response = await subscriptionService.create({
            event_id: eventId,
            buyer: buyer
        });

        if (response.ok) {
            setMessage({ type: 'success', text: "Inscrição confirmada! 🎉" });

            // Aqui está o segredo:
            // O router.refresh() invalida o cache do Server Component
            // e busca os dados do evento (vagas) novamente sem perder o estado do formulário.
            router.refresh();

        } else {
            setMessage({ type: 'error', text: response.msg || "Erro ao se inscrever." });
        }
        setLoading(false);
    }

    return (
        <form action={handleSubscribe} className="space-y-4">
            {/* ... mesmo JSX de antes ... */}
            {message && (
                <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <input name="buyer" required placeholder="Seu nome completo" className="w-full p-2 border rounded-md" />

            <button
                disabled={loading || message?.type === 'success'}
                className="w-full bg-black text-white py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all"
            >
                {loading ? "Processando..." : "Garantir minha vaga"}
            </button>
        </form>
    );
}