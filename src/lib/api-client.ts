import { ApiResponse } from "@/types/api"

export async function apiClient(endpoint: string, options?: RequestInit): Promise<ApiResponse> {
    // No seu apiClient
    let baseUrl: string;
    let url: string

    if (typeof window !== "undefined") {
        url = `/api/${endpoint}`;
    } else {
        // PRIORIDADE 1: Variável manual (mais segura)
        if (process.env.NEXT_PUBLIC_API_URL) {
            baseUrl = process.env.NEXT_PUBLIC_API_URL;
        }
        // PRIORIDADE 2: Variável automática da Vercel (precisa do https://)
        else if (process.env.VERCEL_URL) {
            baseUrl = `https://${process.env.VERCEL_URL}`;
        }
        // PRIORIDADE 3: Localhost
        else {
            baseUrl = "http://localhost:3000";
        }
        url = `${baseUrl}/api/${endpoint}`;
    }
    try {
        const res = await fetch(url, {
            ...options,

            headers: {
                "Content-Type": "application/json",
                ...options?.headers
            }
        })

        if (res.status === 204) return { ok: true, status: 204 }

        const contentType = res.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
            return {
                ok: false,
                status: res.status,
                error: `Unexpected response format: ${res.statusText}`
            }
        }

        const data = await res.json() as ApiResponse
        return {
            ...data,
            ok: data.ok ?? res.ok,
            status: data.status ?? res.status
        }
    } catch (error) {
        console.error("API Client Error:", error);
        return {
            ok: false,
            status: 500,
            error: error instanceof Error ? error.message : "An error occurred while trying to communicate with the server"
        }
    }
}