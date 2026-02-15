import { db } from "@/db"
import { events, subscriptions } from "@/db/schema"
import { apiHandler } from "@/lib/api-handler"
import { AppError } from "@/lib/errors"
import { insertSubscriptionSchema } from "@/schemas/events"
import { eq } from "drizzle-orm"

export const POST = apiHandler(async (req: Request) => {
    const body = await req.json()
    const data = insertSubscriptionSchema.parse(body)

    return await db.transaction(async (tx) => {
        const [event] = await tx
            .select().from(events)
            .where(eq(events.id, data.event_id))

        if (!event) throw new AppError("The event doesn't exist or was alrealdy deleted", 404)

        const current_sold = event.tickets_sold ?? 0
        if (current_sold >= event.tickets) throw new AppError("There are no tickets available", 400)

        const result = await tx.insert(subscriptions)
            .values(data)
            .returning()

        await tx.update(events)
            .set({
                tickets_sold: current_sold + 1
            })
            .where(eq(events.id, data.event_id))

        return {
            ok: true,
            status: 201,
            msg: "Subscription created",
            data: result
        }
    })
})