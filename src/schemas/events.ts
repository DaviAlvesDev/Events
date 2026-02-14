import z from "zod"

export const insertEventSchema = z.object({
    name: z.string().min(4).max(100)
        .transform(val => val.toLowerCase()),

    description: z.string().max(400)
        .transform(val => val.toLowerCase()),

    creator_id: z.uuid(),

    tickets: z.number().int().positive().min(1),

    event_date: z.coerce.date(),
})

export const updateEventSchema = insertEventSchema
    .omit({
        tickets: true
    })
    .extend({
        new_tickets: z.number().int()
    })
    .partial()

export const eventFiltersSchema = insertEventSchema
    .pick({
        name: true,
        tickets: true,
        event_date: true
    })
    .extend({
        id: z.uuid(),
    })
    .partial()

export const eventSubscriptionSchema = z.object({
    id: z.uuid(),
    user_id: z.uuid(),
    event_id: z.uuid()
})

export const updateSubscriptionSchema = eventSubscriptionSchema
    .omit({
        id: true
    })
    .partial()