import { db } from "@/db"
import { events } from "@/db/schemas"
import { apiHandler } from "@/lib/api-handler"
import { AppError } from "@/lib/errors"
import { insertEventSchema } from "@/schemas/events"
import { EventFilters } from "@/types/events"
import { and, eq } from "drizzle-orm"

export const dynamic = 'force-dynamic';

export const GET = apiHandler(async (req: Request) => {
    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries()) as EventFilters

    const conditions = []
    if (query.id) conditions.push(eq(events.id, query.id))
    if (query.name) conditions.push(eq(events.name, query.name))
    if (query.tickets) conditions.push(eq(events.tickets, query.tickets))
    if (query.creator) conditions.push(eq(events.creator, query.creator))
    if (query.event_date) conditions.push(eq(events.event_date, query.event_date))

    const data = await db
        .select().from(events)
        .where(
            conditions.length > 0 ?
                and(...conditions) :
                undefined
        )

    return {
        ok: true,
        status: 200,
        data
    }
})

export const POST = apiHandler(async (req: Request) => {
    const body = await req.json()
    const data = insertEventSchema.parse(body)

    try {
        const result = await db
            .insert(events)
            .values({
                ...data
            })
            .returning()

        if (!result[0]) throw new AppError("An error occured while creating the event", 500)

        return {
            ok: true,
            status: 201,
            msg: "Event created",
            data: result[0]
        }
    } catch (err) {
        console.log("error:", err)
        return {
            ok: false,
            status: 500
        }
    }
})