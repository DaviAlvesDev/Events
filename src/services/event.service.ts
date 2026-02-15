import { apiClient } from "@/lib/api-client";
import { EventFilters, Event, InsertEvent } from "@/types/events"; // Importe seus tipos

export const eventService = {
    getAll: async (filters?: EventFilters) => {
        const params = new URLSearchParams();
        if (filters) {
            // Usamos cast para string pois URLSearchParams espera strings
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) params.append(key, String(value));
            });
        }

        const queryString = params.toString();
        const response = await apiClient(`events${queryString ? `?${queryString}` : ""}`, {
            cache: 'no-store', // FORÇA o Next.js a buscar dados novos sempre
            next: { revalidate: 0 }
        });

        return {
            ...response,
            data: response.data as Event[]
        };
    },

    // Tipagem correta para o Data
    create: async (data: InsertEvent) => {
        return apiClient("events", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    // src/services/event.service.ts
    // src/services/event.service.ts

    getById: async (id: string) => {
        // Mudamos de /id para ?id=id
        const response = await apiClient(`events?id=${id}`);

        return {
            ...response,
            // Como sua rota de lista retorna um array, 
            // precisamos pegar o primeiro item [0]
            data: Array.isArray(response.data) ? (response.data[0] as Event) : (response.data as Event)
        };
    }
};