interface StatusOverlayProps {
  isLoading: boolean
  error?: string
  success?: string
  onClose?: () => void
  onContinue?: () => void
}

export function StatusOverlay({ isLoading, error, success, onClose, onContinue }: StatusOverlayProps) {
  if (!isLoading && !error && !success) return null

  return (
    <div className="status-overlay" role="presentation">
      <div className="status-dialog" role="alertdialog" aria-live="assertive">
        {isLoading && <><span className="loading-spinner" aria-hidden="true" /><strong>Loading</strong><p>Please wait a moment.</p></>}
        {!isLoading && error && <><span className="status-icon status-icon-error" aria-hidden="true">!</span><strong>Something went wrong</strong><p>{error}</p><button className="status-action" type="button" onClick={onClose}>Try again</button></>}
        {!isLoading && !error && success && <><span className="status-icon status-icon-success" aria-hidden="true">✓</span><strong>Account created</strong><p>{success}</p><button className="status-action" type="button" onClick={onContinue}>Continue to sign in</button></>}
      </div>
    </div>
  )
}
