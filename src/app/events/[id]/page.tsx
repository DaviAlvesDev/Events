import { eventService } from "@/services/event.service";
import { subscriptionService } from "@/services/subscription.service"; // Importe o service de inscrições
import { notFound } from "next/navigation";
import { SubscriptionForm } from "@/components/events/subscription-form";
import Link from "next/link";
import { Subscription } from "@/types/events";

type tParams = Promise<{ id: string }>;

export default async function EventPage(props: { params: tParams }) {
    const { id } = await props.params;

    // Buscamos os dois dados ao mesmo tempo
    const [eventRes, subsRes] = await Promise.all([
        eventService.getById(id),
        subscriptionService.getByEvent(id) // Certifique-se que este método existe no seu service
    ]);

    if (!eventRes.ok || !eventRes.data) {
        return notFound();
    }

    const event = eventRes.data;
    const attendees = subsRes.data || [];
    const availableTickets = event.tickets - (event.tickets_sold ?? 0);

    return (
        <main className="container mx-auto py-12 px-4 max-w-4xl">
            <Link href="/" className="text-sm text-gray-500 hover:text-black mb-6 block">
                ← Voltar para a lista
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Coluna Principal */}
                <div className="md:col-span-2 space-y-10">
                    <section>
                        <h1 className="text-4xl font-black capitalize mb-4">{event.name}</h1>
                        <div className="flex gap-4 text-gray-500 text-sm border-b pb-6">
                            <span>📅 {new Date(event.event_date).toLocaleDateString()}</span>
                            <span className="capitalize">👤 Organizado por {event.creator.toLowerCase()}</span>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed pt-6 whitespace-pre-wrap">
                            {event.description}
                        </p>
                    </section>

                    {/* LISTA DE INSCRITOS AQUI */}
                    <section className="pt-10 border-t">
                        <h2 className="text-xl font-bold mb-6">Quem já garantiu presença ({attendees.length})</h2>
                        {attendees.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {attendees.map((sub: Subscription) => {
                                    const name = sub.buyer.trim();
                                    const firstLetter = name.charAt(0).toUpperCase();

                                    return (
                                        <div key={sub.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border">
                                            {/* ÍCONE: Aqui você usa a primeira letra */}
                                            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                                {firstLetter}
                                            </div>

                                            {/* TEXTO: Aqui você usa o nome TODO, sem adicionar letras na frente */}
                                            <span className="font-medium text-gray-800 capitalize">
                                                {name.toLowerCase()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">Seja o primeiro a se inscrever!</p>
                        )}
                    </section>
                </div>

                {/* Sidebar de Inscrição */}
                <div className="space-y-6">
                    <div className="bg-white border-2 border-black rounded-2xl p-6 sticky top-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <div className="text-center mb-6">
                            <span className="text-4xl font-black">{availableTickets}</span>
                            <p className="text-xs uppercase font-bold text-gray-500 mt-1">Vagas Restantes</p>
                        </div>

                        {availableTickets > 0 ? (
                            <SubscriptionForm eventId={event.id} />
                        ) : (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold border-2 border-red-200">
                                ESGOTADO 🚫
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}