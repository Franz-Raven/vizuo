export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-background text-foreground">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-4 py-6 md:px-6">
        <div className="text-sm opacity-80">Vizuo © {year}. All rights reserved.</div>

        <div className="flex items-center gap-3">
          <a className="inline-flex h-9 w-9 items-center justify-center rounded-full opacity-80 transition hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
             href="#" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M23.5 6.2a4 4 0 0 0-2.8-2.8C18.8 3 12 3 12 3s-6.8 0-8.7.4A4 4 0 0 0 .5 6.2 41.6 41.6 0 0 0 0 12a41.6 41.6 0 0 0 .5 5.8 4 4 0 0 0 2.8 2.8C5.2 21 12 21 12 21s6.8 0 8.7-.4a4 4 0 0 0 2.8-2.8c.3-1.9.5-3.9.5-5.8s-.2-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
            </svg>
          </a>

          <a className="inline-flex h-9 w-9 items-center justify-center rounded-full opacity-80 transition hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
             href="#" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.7c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12"/>
            </svg>
          </a>

          <a className="inline-flex h-9 w-9 items-center justify-center rounded-full opacity-80 transition hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
             href="#" aria-label="X">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M18 2H6A4 4 0 0 0 2 6v12a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4zM8 6l4.6 6.1L8.3 18H10l3.1-4 2.7 4H16l-4.6-6.1L15.7 6H14l-2.9 3.8L8.5 6H8z"/>
            </svg>
          </a>

          <a className="inline-flex h-9 w-9 items-center justify-center rounded-full opacity-80 transition hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
             href="#" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v13H0zM8 8h4.6v1.8h.1c.6-1.1 2.2-2.3 4.6-2.3 4.9 0 5.8 3.2 5.8 7.4V21h-5v-6.2c0-1.5 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V21H8z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
