import { db } from "@/db"
import { events, subscriptions } from "@/db/schemas"
import { apiHandler } from "@/lib/api-handler"
import { AppError } from "@/lib/errors"
import { ApiContext } from "@/types/api"
import { eq } from "drizzle-orm"

export const GET = apiHandler(async (req: Request, context: ApiContext) => {
    const { event_id } = await context.params

    const event = await db
        .select().from(events)
        .where(eq(events.id, event_id as string))

    if (!event[0]) throw new AppError("The event doesn't exist or was already deleted", 404)

    const subs = await db
        .select({
            id: subscriptions.id,
            buyer: subscriptions.buyer
        })
        .from(subscriptions)
        .where(eq(subscriptions.event_id, event_id as string))

    return {
        ok: true,
        status: 200,
        data: subs
    }
})