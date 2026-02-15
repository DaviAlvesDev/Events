import { ApiContext, ApiResponse, CommonApi } from "@/types/api"
import { AppError } from "./errors"
import { NextResponse } from "next/server"
import { ZodError } from "zod"

function createApiResponse(payload: ApiResponse): NextResponse<ApiResponse> {
    return NextResponse.json(payload, { status: payload.status })
}

export function apiHandler(handler: CommonApi) {
    return async (req: Request, context: ApiContext): Promise<NextResponse<ApiResponse>> => {
        try {
            const res = await handler(req, context)
            return createApiResponse(res)
        } catch (error) {
            if (error instanceof AppError) {
                if (error.status >= 500) {
                    console.error(`[${req.method}] ${req.url} - Error: ${error.message} => ${error.stack}`)
                }

                return createApiResponse({
                    ok: false,
                    status: error.status,
                    error: error.message
                })
            }

            if (error instanceof ZodError) {
                return createApiResponse({
                    ok: false,
                    status: 400,
                    error: "Validation failed",
                    issues: error.issues
                })
            }
            const errorMessage = error instanceof Error ? error.message : String(error)
            console.error(`[${req.method}] ${req.url} - Unexpected Error: ${errorMessage}`)

            return createApiResponse({
                ok: false,
                status: 500,
                error: "Internal server error"
            })
        }
    }
}