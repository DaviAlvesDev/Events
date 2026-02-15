import { db } from "@/db"
import { events } from "@/db/schemas"
import { apiHandler } from "@/lib/api-handler"
import { AppError } from "@/lib/errors"
import { updateEventSchema } from "@/schemas/events"
import { ApiContext } from "@/types/api"
import { eq } from "drizzle-orm"

export const PATCH = apiHandler(async (req: Request, context: ApiContext) => {
    const { id } = await context.params

    const oldEvent = await db
        .select().from(events)
        .where(eq(events.id, id as string))

    if (!oldEvent[0]) throw new AppError("The event doesn't exist or was alrealdy deleted", 404)


    const body = await req.json()
    const data = updateEventSchema.parse(body)

    let new_tickets
    if (data.new_tickets) {
        new_tickets = oldEvent[0].tickets + data.new_tickets
        if (new_tickets < oldEvent[0].tickets_sold!) {
            new_tickets = oldEvent[0].tickets_sold!
        }
    }

    const newEvent = {
        name: data.name || oldEvent[0].name,
        description: data.description || oldEvent[0].description,
        event_date: data.event_date || oldEvent[0].event_date,
        tickets: new_tickets !== undefined ? new_tickets : oldEvent[0].tickets
    }

    const result = await db
        .update(events)
        .set({
            ...newEvent
        })
        .returning()

    if (!result[0]) throw new AppError("An error occured while updating the event", 500)

    return {
        ok: true,
        status: 204,
    }
})

export const DELETE = apiHandler(async (req: Request, context: ApiContext) => {
    const { id } = await context.params

    const result = await db
        .delete(events)
        .where(eq(events.id, id as string))
        .returning()

    if (!result[0]) throw new AppError("An error occured while updating the event", 500)

    return {
        ok: true,
        status: 204,
    }
})