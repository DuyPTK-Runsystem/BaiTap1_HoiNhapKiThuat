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
import { registerSchema } from '../schemas/authSchemas'
import type { RegisterInput } from '../types/auth'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuth()
  const [serverError, setServerError] = useState('')
  const [validationPopup, setValidationPopup] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { register, handleSubmit, clearErrors, formState: { errors } } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), defaultValues: { termsAgreement: false } })
  const [checkedPassword, setCheckedPassword] = useState('')
  const passwordRegistration = register('password')
  const passwordRequirements = [
    ['At least 6 characters', checkedPassword.length >= 6],
    ['Contain at least one number', /[0-9]/.test(checkedPassword)],
    ['Contain at least one letter', /[A-Za-z]/.test(checkedPassword)],
  ] as const

  const onSubmit = async (input: RegisterInput) => {
    setServerError('')
    setValidationPopup('')
    try {
      await registerUser(input)
      setSuccessMessage('Your account is ready to use.')
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Không thể tạo tài khoản')
    }
  }

  return (
    <AuthShell title="Create account" subtitle="Set up your Logify account in a few seconds.">
      <form className="auth-form register-form" onSubmit={handleSubmit(onSubmit, () => setValidationPopup('Vui lòng kiểm tra thông tin đăng ký'))}>
        {serverError && <div className="server-error" role="alert">{serverError}</div>}
        <FormField label="Username" id="username" placeholder="Choose a username" autoComplete="username" error={errors.username?.message} {...register('username')} />
        <FormField label="Email" id="email" type="email" placeholder="you@example.com" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <PasswordField label="Password" id="password" placeholder="At least 6 characters" autoComplete="new-password" error={errors.password?.message} {...passwordRegistration} onBlur={(event) => { passwordRegistration.onBlur(event); setCheckedPassword(event.target.value) }} />
        <ul className="password-requirements" aria-label="Password requirements">
          {passwordRequirements.map(([label, met]) => <li className={met ? 'requirement-met' : ''} key={label}><span aria-hidden="true">{met ? '✓' : '×'}</span>{label}</li>)}
        </ul>
        <PasswordField label="Confirm password" id="confirmPassword" placeholder="Repeat your password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <label className="terms-field"><input type="checkbox" {...register('termsAgreement')} /> <span>I agree to the <a href="#terms">Terms &amp; Conditions</a>{errors.termsAgreement?.message && <small role="alert">{errors.termsAgreement.message}</small>}</span></label>
        <SubmitButton isLoading={isLoading}>Create account</SubmitButton>
      </form>
      <p className="switch-copy">Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link></p>
      <StatusOverlay isLoading={isLoading} error={serverError || validationPopup} success={successMessage} onClose={() => { setServerError(''); setValidationPopup(''); clearErrors() }} onContinue={() => navigate(ROUTES.LOGIN)} />
    </AuthShell>
  )
}
