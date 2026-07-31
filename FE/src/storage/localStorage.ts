import { STORAGE_KEYS } from '../constants/storage'
import type { PublicUser } from '../types/auth'

const read = <T>(key: string, fallback: T): T => {
  const value = localStorage.getItem(key)
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export const getSession = (): PublicUser | null => read<PublicUser | null>(STORAGE_KEYS.SESSION, null)

export const saveSession = (user: PublicUser): void => {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user))
}

export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.SESSION)
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
}

export const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
}

export const getAccessToken = (): string | null => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

export const getRefreshToken = (): string | null => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
