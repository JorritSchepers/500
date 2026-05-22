export function ConfirmDeleteModal({
  roundId,
  deleting,
  onConfirm,
  onCancel,
}: {
  roundId: number
  deleting: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/70" onClick={onCancel} />
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900 rounded-t-2xl px-5 pt-5 pb-8 border-t border-zinc-800">
        <div className="w-10 h-1 rounded-full bg-zinc-700 mx-auto mb-5" />

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-white mb-1">Ronde {roundId} verwijderen?</h2>
          <p className="text-sm text-zinc-400">Dit kan niet ongedaan worden gemaakt.</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="w-full bg-red-600 text-white rounded-xl py-3.5 text-sm font-semibold disabled:opacity-40 hover:bg-red-500 active:scale-[0.98] transition-all"
          >
            {deleting ? 'Verwijderen…' : 'Ja, verwijder ronde'}
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-zinc-800 text-zinc-300 rounded-xl py-3.5 text-sm font-semibold hover:bg-zinc-700 active:scale-[0.98] transition-all"
          >
            Annuleer
          </button>
        </div>
      </div>
    </>
  )
}