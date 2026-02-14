import { users } from "@/db/schema"
import { registerUserSchema, updateUserSchema, userFiltersSchema } from "@/schemas/users"
import z from "zod"

export type User = typeof users.$inferSelect

export type UserFilters = z.infer<typeof userFiltersSchema>

export type InsertUser = z.infer<typeof registerUserSchema>

export type UpdateUser = z.infer<typeof updateUserSchema>