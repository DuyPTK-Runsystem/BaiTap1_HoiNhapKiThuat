import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(6, 'Mật khẩu phải có ít nhất 6 kí tự')
  .regex(/[A-Za-z]/, 'Mật khẩu phải bao gồm kí tự chữ cái')
  .regex(/[0-9]/, 'Mật khẩu phải bao gồm kí tự số')

export const registerSchema = z
  .object({
    username: z.string().trim().min(1, 'Vui lòng nhập username'),
    email: z.string().trim().email('Email không đúng định dạng'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    termsAgreement: z.boolean().refine((value) => value, 'Vui lòng đồng ý với điều khoản phần mềm'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu xác nhận không trùng khớp',
  })

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Vui lòng nhập username'),
  password: z.string().min(1, 'Vui lòng nhập password'),
})
