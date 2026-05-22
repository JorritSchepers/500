export function FloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-20 w-14 h-14 rounded-full bg-white text-zinc-950 flex items-center justify-center text-2xl font-light hover:scale-105 active:scale-95 transition-transform shadow-none"
      aria-label="Ronde toevoegen"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    </button>
  )
}