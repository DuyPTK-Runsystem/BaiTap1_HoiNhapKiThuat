import { getUsers, saveUsers } from '../storage/localStorage'
import type { LoginInput, PublicUser, RegisterInput, RestResponse, User } from '../types/auth'

const wait = (milliseconds = 500): Promise<void> => new Promise((resolve) => setTimeout(resolve, milliseconds))

const publicUser = ({ userId, username, email }: User): PublicUser => ({ userId, username, email })

export const register = async (input: RegisterInput): Promise<RestResponse<PublicUser>> => {
  await wait()
  const users = getUsers()
  if (users.some((user) => user.username.toLowerCase() === input.username.toLowerCase())) {
    return { statusCode: 409, error: 'Conflict', message: 'Username đã tồn tại', data: null }
  }
  if (users.some((user) => user.email.toLowerCase() === input.email.toLowerCase())) {
    return { statusCode: 409, error: 'Conflict', message: 'Email đã tồn tại', data: null }
  }
  const user: User = {
    userId: Date.now(),
    username: input.username,
    email: input.email,
    password: input.password,
    termsAgreement: input.termsAgreement,
  }
  saveUsers([...users, user])
  return { statusCode: 201, error: null, message: 'Register successfully', data: publicUser(user) }
}

export const login = async (input: LoginInput): Promise<RestResponse<PublicUser>> => {
  await wait()
  const user = getUsers().find((item) => item.username.toLowerCase() === input.username.toLowerCase())
  if (!user || user.password !== input.password) {
    return { statusCode: 400, error: 'Bad Request', message: 'Vui lòng kiểm tra username và password', data: null }
  }
  return { statusCode: 200, error: null, message: 'Login successfully', data: publicUser(user) }
}
