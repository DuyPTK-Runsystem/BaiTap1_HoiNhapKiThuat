import { getAccessToken } from '../storage/localStorage'
import type { AccessData, LoginData, LoginInput, PublicUser, RegisterInput, RestResponse } from '../types/auth'

interface ApiUser {
  id: number
  username: string
  email: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/v1'

const request = async <T>(path: string, init: RequestInit = {}): Promise<RestResponse<T>> => {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  const accessToken = getAccessToken()
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers })
    const body = await response.json() as Partial<RestResponse<T>> & { detail?: unknown }
    if (typeof body.statusCode === 'number') return body as RestResponse<T>
    return {
      statusCode: response.status,
      error: body.error ?? (response.ok ? null : response.statusText),
      message: typeof body.detail === 'string'
        ? body.detail
        : body.detail && typeof body.detail === 'object'
          ? body.detail as Record<string, unknown>
          : null,
      data: (body.data as T | null | undefined) ?? null,
    }
  } catch {
    return { statusCode: 0, error: 'Network Error', message: 'Unable to connect to the server', data: null }
  }
}

export const register = (input: RegisterInput): Promise<RestResponse<PublicUser>> => request<PublicUser>('/auth/register', {
  method: 'POST',
  body: JSON.stringify(input),
}).then((response) => ({ ...response, data: response.data ? normalizeUser(response.data as unknown as ApiUser) : null }))

export const login = (input: LoginInput): Promise<RestResponse<LoginData>> => request<LoginData>('/auth/login', {
  method: 'POST',
  body: JSON.stringify(input),
}).then((response) => ({
  ...response,
  data: response.data ? { ...response.data, user: normalizeUser(response.data.user as unknown as ApiUser) } : null,
}))

export const me = (): Promise<RestResponse<PublicUser>> => request<ApiUser>('/auth/me').then((response) => ({
  ...response,
  data: response.data ? normalizeUser(response.data) : null,
}))

export const refreshAccessToken = (refreshToken: string): Promise<RestResponse<AccessData>> => request<AccessData>('/auth/access', {
  method: 'POST',
  body: JSON.stringify({ refreshToken }),
})

export const logout = (refreshToken: string): Promise<RestResponse<null>> => request<null>('/auth/logout', {
  method: 'POST',
  body: JSON.stringify({ refreshToken }),
})

const normalizeUser = (user: ApiUser): PublicUser => ({ userId: user.id, username: user.username, email: user.email })
