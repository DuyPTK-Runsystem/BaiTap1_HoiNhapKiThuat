interface SubmitButtonProps {
  isLoading: boolean
  children: string
}

export function SubmitButton({ isLoading, children }: SubmitButtonProps) {
  return <button className="submit-button" disabled={isLoading} type="submit">{isLoading ? 'Đang xử lý...' : children}</button>
}
