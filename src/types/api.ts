export type ApiResponse = {
    ok: boolean,
    msg?: string,
    error?: string,
    details?: Record<string, string | string[]>,
    data?: object | object[]
}

export type ApiContext = {
    params: Promise<Record<string, string | string[]>>
}

export type CommonApi = (
    req: Request,
    context?: ApiContext
) => Promise<ApiResponse>