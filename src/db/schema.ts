import { integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    email: text("email").notNull().unique(),
    role: varchar("role", { length: 20 }).default("user"),
    created_at: timestamp("created_at").defaultNow()
})

export const events = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    creator_id: uuid("creator_id").references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade"
    }),
    tickets: integer("tickets").notNull(),
    tickets_sold: integer("tickets_sold").default(0),
    event_date: timestamp("event_date", { withTimezone: true, mode: "date" }).notNull(),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow()
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
        }),

    created_at: timestamp("created_at").defaultNow()
})