import type { ReactNode } from 'react'

export function AuthShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <main className="auth-page">
      <header className="site-header"><h1>Your Logo</h1></header>
      <section className="auth-content">
        <div className="auth-grid">
          <div className="auth-card">
          <p className="eyebrow panel-eyebrow">WELCOME BACK</p>
          <h2>{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
          </div>
          <div className="auth-illustration">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuABaQQpD9nQJ7ujuiWgEEN7gyZ7KqtoCM92bFEC6O1D4OTALn57GFimPKLj6jBxkVf_kh95FBEgOA-6iTeSsZ8fhly1zZ7RsahWAi1QTIV_YqCuxmFU3Nb95LUR1IOiQZ4JDlY9lhOv9Blaa2g9BycLBjC8LDaNMeAFKRkxJSbRJy6XkzSnfkV7mexkAYAT1JEpy9ZghCLK7NzVnAVOHIPPFswcHON2WMSC-cjMYkDM4pFwMXsnescl" alt="People collaborating on a digital project" />
          </div>
        </div>
      </section>
    </main>
  )
}
