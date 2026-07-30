import { getUsers, saveUsers } from '../storage/localStorage'
import type { ApiError, LoginInput, PublicUser, RegisterInput, User } from '../types/auth'

const wait = (milliseconds = 500): Promise<void> => new Promise((resolve) => setTimeout(resolve, milliseconds))

const publicUser = ({ userId, username, email }: User): PublicUser => ({ userId, username, email })

export const register = async (input: RegisterInput): Promise<PublicUser> => {
  await wait()
  const users = getUsers()
  if (users.some((user) => user.username.toLowerCase() === input.username.toLowerCase())) {
    throw { status: 409, message: 'Username đã tồn tại' } satisfies ApiError
  }
  if (users.some((user) => user.email.toLowerCase() === input.email.toLowerCase())) {
    throw { status: 409, message: 'Email đã tồn tại' } satisfies ApiError
  }
  const user: User = {
    userId: Date.now(),
    username: input.username,
    email: input.email,
    password: input.password,
    termsAgreement: input.termsAgreement,
  }
  saveUsers([...users, user])
  return publicUser(user)
}

export const login = async (input: LoginInput): Promise<PublicUser> => {
  await wait()
  const user = getUsers().find((item) => item.username.toLowerCase() === input.username.toLowerCase())
  if (!user || user.password !== input.password) {
    throw { status: 400, message: 'Vui lòng kiểm tra username và password' } satisfies ApiError
  }
  return publicUser(user)
}
