import { forwardRef, type InputHTMLAttributes } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField({ label, error, id, ...props }, ref) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label} <span className="required-mark">(*)</span></span>
      <input ref={ref} id={id} aria-invalid={Boolean(error)} {...props} />
      {error && <small role="alert">{error}</small>}
    </label>
  )
})
