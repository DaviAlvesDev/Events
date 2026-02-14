import { integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    email: text("email").notNull().unique(),
    created_at: timestamp("created_at").defaultNow()
})

export const events = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    tickets: integer("tickets").notNull(),
    tickets_sold: integer("tickets_sold").default(0),
    date: timestamp("date").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow()
})

export const subscriptions = pgTable("subscriptions", {
    id: uuid("id").primaryKey().defaultRandom(),

    user_id: uuid("user_id")
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
            onUpdate: "cascade"
        }),

    event_id: uuid("event_id")
        .notNull()
        .references(() => events.id, {
            onDelete: "cascade",
            onUpdate: "cascade"
        })
})