import { useState, type InputHTMLAttributes } from 'react'

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ) : (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path d="m3 3 18 18M10.6 6.2C11.05 6.07 11.52 6 12 6c6 0 9.5 6 9.5 6a17.3 17.3 0 0 1-3.05 3.68M6.18 6.18C3.8 7.7 2.5 12 2.5 12s3.5 6 9.5 6c.84 0 1.63-.14 2.36-.37" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

export function PasswordField({ label, error, id, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <span className="password-input-wrap">
        <input id={id} aria-invalid={Boolean(error)} type={visible ? 'text' : 'password'} {...props} />
        <button className="password-toggle" type="button" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible((current) => !current)}>
          <EyeIcon visible={visible} />
        </button>
      </span>
      {error && <small role="alert">{error}</small>}
    </label>
  )
}
