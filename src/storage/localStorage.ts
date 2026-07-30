import { STORAGE_KEYS } from '../constants/storage'
import type { PublicUser, User } from '../types/auth'

const read = <T>(key: string, fallback: T): T => {
  const value = localStorage.getItem(key)
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export const getUsers = (): User[] => read<User[]>(STORAGE_KEYS.USERS, [])

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

export const getSession = (): PublicUser | null => read<PublicUser | null>(STORAGE_KEYS.SESSION, null)

export const saveSession = (user: PublicUser): void => {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user))
}

export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.SESSION)
}
