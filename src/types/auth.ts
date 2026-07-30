export interface User {
  userId: number
  username: string
  email: string
  password: string
  termsAgreement: boolean
}

export interface PublicUser {
  userId: number
  username: string
  email: string
}

export interface RegisterInput {
  username: string
  email: string
  password: string
  confirmPassword: string
  termsAgreement: boolean
}

export interface LoginInput {
  username: string
  password: string
}

export interface ApiError {
  status: number
  message: string
}
