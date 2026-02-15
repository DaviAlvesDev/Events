import { apiClient } from "@/lib/api-client";
import { Subscription } from "@/types/events";

export const subscriptionService = {
    create: async (data: { event_id: string; buyer: string }) => {
        return apiClient("subscriptions", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    // No subscription.service.ts existente:
    // src/services/subscription.service.ts

    getByEvent: async (eventId: string) => {
        const response = await apiClient(`subscriptions/${eventId}`);
        return {
            ...response,
            // Aqui dizemos explicitamente que o data é um array
            data: (response.data as Subscription[]) || []
        };
    }
};