import z from "zod"

export const registerUserSchema = z.object({
    name: z.string()
        .max(50)
        .transform(val => val.toLowerCase()),

    email: z.email(),

    password: z.string().min(8)
})

export const loginUserSchema = registerUserSchema.pick({
    email: true,
    password: true
})

export const updateUserSchema = registerUserSchema.pick({
    name: true,
    email: true
}).partial()

export const userFiltersSchema = registerUserSchema.pick({
    name: true,
    email: true,
}).extend({
    id: z.uuid()
}).partial()