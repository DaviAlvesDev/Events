import { events, subscriptions } from "@/db/schemas"
import { eventFiltersSchema, insertEventSchema, updateEventSchema, updateSubscriptionSchema } from "@/schemas/events"
import z from "zod"

export type Event = typeof events.$inferSelect

export type Subscription = typeof subscriptions.$inferSelect

export type EventFilters = z.infer<typeof eventFiltersSchema>

export type InsertEvent = z.infer<typeof insertEventSchema>

export type InsertSubscription = typeof subscriptions.$inferInsert

export type UpdateEvent = z.infer<typeof updateEventSchema>

export type UpdateSubscription = z.infer<typeof updateSubscriptionSchema>