import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from '../components/AuthShell'
import { FormField } from '../components/FormField'
import { PasswordField } from '../components/PasswordField'
import { SubmitButton } from '../components/SubmitButton'
import { StatusOverlay } from '../components/StatusOverlay'
import { ROUTES } from '../constants/storage'
import { useAuth } from '../context/AuthContext'
import { loginSchema } from '../schemas/authSchemas'
import type { LoginInput } from '../types/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const [serverError, setServerError] = useState('')
  const [validationPopup, setValidationPopup] = useState('')
  const { register, handleSubmit, clearErrors, formState: { errors } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (input: LoginInput) => {
    setServerError('')
    setValidationPopup('')
    try {
      await login(input)
      navigate(ROUTES.HOME)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Vui lòng kiểm tra username và password')
    }
  }

  return (
    <AuthShell title="Sign in" subtitle="Enter your details to continue to your account.">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit, () => setValidationPopup('Vui lòng kiểm tra username và password'))}>
        {serverError && <div className="server-error" role="alert">{serverError}</div>}
        <FormField label="Username" id="username" placeholder="Your username" autoComplete="username" error={errors.username?.message} {...register('username')} />
        <PasswordField label="Password" id="password" placeholder="Your password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
        <SubmitButton isLoading={isLoading}>Sign in</SubmitButton>
      </form>
      <p className="switch-copy">Don't have an account? <Link to={ROUTES.REGISTER}>Sign up</Link></p>
      <StatusOverlay isLoading={isLoading} error={serverError || validationPopup} onClose={() => { setServerError(''); setValidationPopup(''); clearErrors() }} />
    </AuthShell>
  )
}
