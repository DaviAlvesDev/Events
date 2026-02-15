import { Event } from "@/types/events";
import Link from "next/link";

export function EventCard({ event }: { event: Event }) {
    const availableTickets = event.tickets - (event.tickets_sold ?? 0);

    return (
        <div className="border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-card">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold capitalize">{event.name}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded ${availableTickets > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {availableTickets > 0 ? `${availableTickets} vagas` : 'Esgotado'}
                </span>
            </div>

            <p className="text-muted-foreground line-clamp-2 mb-4 text-sm">
                {event.description}
            </p>

            <div className="flex items-center gap-2 mb-6 text-sm font-medium">
                <span className="text-primary">📅 {new Date(event.event_date).toLocaleDateString()}</span>
                <span className="text-gray-400">|</span>
                <span className="capitalize text-gray-500">👤 {event.creator}</span>
            </div>

            <Link
                href={`/events/${event.id}`}
                className="block text-center w-full py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
                Ver Detalhes
            </Link>
        </div>
    );
}