import z from "zod"

export type ApiResponse = {
    ok: boolean,
    status: number,
    msg?: string,
    error?: string,
    issues?: z.core.$ZodIssue[]
    data?: object | object[]
}

export type ApiContext = {
    params: Promise<Record<string, string | string[]>>
}

export type CommonApi = (
    req: Request,
    context: ApiContext
) => Promise<ApiResponse>