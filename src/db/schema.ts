import { integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const events = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    creator: varchar("creator", { length: 50 }).notNull(),
    tickets: integer("tickets").notNull(),
    tickets_sold: integer("tickets_sold").default(0),
    event_date: timestamp("event_date", { withTimezone: true, mode: "date" }).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow().$onUpdate(() => new Date())
})

export const subscriptions = pgTable("subscriptions", {
    id: uuid("id").primaryKey().defaultRandom(),

    buyer: varchar("buyer", { length: 50 }).notNull(),

    event_id: uuid("event_id")
        .notNull()
        .references(() => events.id, {
            onDelete: "cascade",
            onUpdate: "cascade"
        }),

    created_at: timestamp("created_at").defaultNow()
})