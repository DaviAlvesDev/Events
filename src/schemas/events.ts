import z from "zod"

export const insertEventSchema = z.object({
    name: z.string().min(4).max(100)
        .transform(val => val.toLowerCase()),

    description: z.string().max(400)
        .transform(val => val.toLowerCase()),

    creator: z.string().min(4).max(50)
        .transform(val => val.toLowerCase()),

    tickets: z.coerce.number().int().positive().min(1),

    event_date: z.coerce.date()
        .refine(val => val > new Date(), "Event date must be in the future"),
})

export const updateEventSchema = insertEventSchema
    .omit({
        tickets: true,
        creator: true,
    })
    .extend({
        new_tickets: z.coerce.number().int()
    })
    .partial()

export const eventFiltersSchema = insertEventSchema
    .pick({
        name: true,
        tickets: true,
        event_date: true,
        creator: true,
    })
    .extend({
        id: z.uuid(),
    })
    .partial()

export const insertSubscriptionSchema = z.object({
    buyer: z.string().min(4).max(50)
        .transform(val => val.toLowerCase()),
    event_id: z.uuid()
})

export const updateSubscriptionSchema = insertSubscriptionSchema.partial()