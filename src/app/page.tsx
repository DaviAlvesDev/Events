import { eventService } from "@/services/event.service";
import { EventCard } from "@/components/events/event-card"; // Vamos criar esse
import Link from "next/link";

export const revalidate = 0;

export default async function HomePage() {
    const response = await eventService.getAll();
    console.log("EVENTOS RECEBIDOS NA HOME:", response.data);

    return (
        <main className="container mx-auto py-10 px-4">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Eventos</h1>
                    <p className="text-muted-foreground">Descubra e garanta sua vaga nos melhores eventos.</p>
                </div>
                <Link
                    href="/events/new"
                    className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-all"
                >
                    Criar Evento
                </Link>
            </header>

            {/* Grid de Eventos */}
            {response.ok && response.data?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {response.data.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-xl">
                    <p className="text-lg text-muted-foreground">Nenhum evento encontrado. Que tal criar o primeiro?</p>
                </div>
            )}
        </main>
    );
}