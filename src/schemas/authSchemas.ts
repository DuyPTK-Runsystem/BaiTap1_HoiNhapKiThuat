import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(6, 'Password must have at least 6 characters')
  .regex(/[A-Za-z]/, 'Password must include letter characters')
  .regex(/[0-9]/, 'Password must include number characters')

export const registerSchema = z
  .object({
    username: z.string().trim().min(1, 'Please type your username'),
    email: z.string().trim().email('Invalid email format'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    termsAgreement: z.boolean().refine((value) => value, 'Please agree to the terms and conditions'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Confirm password must match password',
  })

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Please type your username'),
  password: z.string().min(1, 'Please type your password'),
})
