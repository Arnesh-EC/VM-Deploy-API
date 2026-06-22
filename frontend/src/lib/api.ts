/**
 * Typed client for the FastAPI backend (vmkit / configgen / isokit).
 *
 * Requests go to `/api/*`, which the Vite dev server proxies to the backend
 * (see vite.config.ts). In production, serve the built frontend behind the same
 * origin as the API, or set up an equivalent `/api` reverse-proxy.
 */

const BASE = "/api"

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function request<T>(
  path: string,
  init?: RequestInit,
  asText = false,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "content-type": "application/json", ...init?.headers },
    ...init,
  })

  if (!res.ok) {
    // FastAPI/Pydantic errors come back as JSON `{ detail: ... }`.
    let message = `${res.status} ${res.statusText}`
    try {
      const body = await res.json()
      if (body?.detail) {
        message =
          typeof body.detail === "string"
            ? body.detail
            : JSON.stringify(body.detail)
      }
    } catch {
      // non-JSON body — keep the status line.
    }
    throw new ApiError(res.status, message)
  }

  return (asText ? res.text() : res.json()) as Promise<T>
}

// --- /health ---------------------------------------------------------------

export interface Health {
  status: string
  libraries: {
    configgen: string[]
    vmkit: string
    isokit: string
  }
}

export const getHealth = () => request<Health>("/health")

// --- /generate/hostname ----------------------------------------------------

export type Platform = "linux" | "windows"

export interface HostnameRequest {
  platform: Platform
  hostname: string
}

export const generateHostname = (req: HostnameRequest) =>
  request<string>(
    "/generate/hostname",
    { method: "POST", body: JSON.stringify(req) },
    true,
  )

// --- /generate/network -----------------------------------------------------

export interface NetworkRequest {
  platform: Platform
  dhcp?: boolean
  ip?: string | null
  prefix?: number | null
  gateway?: string | null
  dns1?: string | null
  dns2?: string | null
  dns_suffix?: string | null
}

export const generateNetwork = (req: NetworkRequest) =>
  request<string>(
    "/generate/network",
    { method: "POST", body: JSON.stringify(req) },
    true,
  )
