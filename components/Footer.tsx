export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 py-14 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <circle cx="24" cy="24" r="16" stroke="#22D3EE" strokeWidth="0.6" opacity="0.3" />
            <circle cx="24" cy="24" r="9" stroke="#2E6BFF" strokeWidth="0.9" opacity="0.6" />
            <circle cx="24" cy="24" r="3" fill="#22D3EE" />
          </svg>
          <span className="font-display text-base font-medium">TeachDB</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
          <a
            href="https://github.com/TOMIKICHI-HASHIMOTO/TeachDB"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            GitHub
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            LinkedIn
          </a>
          <a href="mailto:teachdb.project@gmail.com" className="transition-colors hover:text-ink">
            teachdb.project@gmail.com
          </a>
        </div>

        <p className="text-xs text-faint">© {new Date().getFullYear()} TeachDB</p>
      </div>
    </footer>
  );
}
