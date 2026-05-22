import { useRef, useState } from "react"

const SWIPE_THRESHOLD = 72 // px to trigger reveal
const DELETE_ZONE = 80    // width of the red delete area

export function SwipeableRow({
  row,
  jokerString,
  onDeleteRequest,
}: {
  row: RoundRow
  jokerString: (n: number) => string
  onDeleteRequest: () => void
}) {
  const jLeads = row.j_score > row.b_score
  const bLeads = row.b_score > row.j_score

  const [offset, setOffset] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const startX = useRef<number | null>(null)
  const startOffset = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  function onPointerDown(e: React.PointerEvent) {
    // Only respond to horizontal drags; don't hijack vertical scroll
    startX.current = e.clientX
    startOffset.current = offset
    containerRef.current?.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    const newOffset = Math.max(-DELETE_ZONE, Math.min(0, startOffset.current + dx))
    setOffset(newOffset)
  }

  function onPointerUp() {
    if (startX.current === null) return
    startX.current = null

    if (offset < -SWIPE_THRESHOLD) {
      // Snap open
      setOffset(-DELETE_ZONE)
      setRevealed(true)
    } else {
      // Snap closed
      setOffset(0)
      setRevealed(false)
    }
  }

  function handleDeleteClick() {
    // Reset row position first, then show confirmation
    setOffset(0)
    setRevealed(false)
    onDeleteRequest()
  }

  function handleClose() {
    setOffset(0)
    setRevealed(false)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Red delete background */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center bg-red-600"
        style={{ width: DELETE_ZONE }}
      >
        <button
          onClick={handleDeleteClick}
          className="flex flex-col items-center justify-center w-full h-full text-white active:bg-red-700 transition-colors"
          aria-label="Verwijder ronde"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-1"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
          <span className="text-[10px] font-semibold tracking-wide">Verwijder</span>
        </button>
      </div>

      {/* Row content — draggable */}
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          transform: `translateX(${offset}px)`,
          transition: startX.current === null ? 'transform 0.25s ease' : 'none',
          touchAction: 'pan-y', // allow vertical scroll, handle horizontal ourselves
        }}
        className={`grid grid-cols-[3rem_1fr_auto_1fr] items-center px-4 py-3 cursor-grab active:cursor-grabbing select-none ${
          jLeads
            ? 'bg-linear-to-r from-emerald-500/20 via-transparent to-transparent'
            : bLeads
            ? 'bg-linear-to-l from-fuchsia-500/20 via-transparent to-transparent'
            : ''
        } bg-zinc-950`}
      >
        <span className="text-xs text-zinc-600 tabular-nums">{row.round_id}</span>

        <div className="flex flex-col gap-0.5">
          <span
            className={`text-base font-semibold tabular-nums ${
              row.j_score < 0 ? 'text-red-400' : jLeads ? 'text-emerald-400' : 'text-zinc-300'
            }`}
          >
            {row.j_score > 0 ? `+${row.j_score}` : row.j_score}
            {row.j_jokers > 0 && (
              <span className="ml-1.5 text-[10px] font-normal text-amber-500 tracking-wide">
                {jokerString(row.j_jokers)}
              </span>
            )}
          </span>
          <span className="text-xs text-zinc-600 tabular-nums">
            {row.j_total.toLocaleString('nl-NL')}
          </span>
        </div>

        <div className="px-3 text-center">
          <span
            className={`text-[11px] tabular-nums font-medium ${
              jLeads ? 'text-emerald-500' : bLeads ? 'text-fuchsia-500' : 'text-zinc-700'
            }`}
          >
            {row.j_score === row.b_score
              ? '—'
              : jLeads
              ? `+${row.j_score - row.b_score}`
              : `+${row.b_score - row.j_score}`}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 items-end">
          <span
            className={`text-base font-semibold tabular-nums ${
              row.b_score < 0 ? 'text-red-400' : bLeads ? 'text-fuchsia-400' : 'text-zinc-300'
            }`}
          >
            {row.b_jokers > 0 && (
              <span className="ml-1.5 text-[10px] font-normal text-amber-500 tracking-wide">
                {jokerString(row.b_jokers)}
              </span>
            )}
            {row.b_score > 0 ? `+${row.b_score}` : row.b_score}
          </span>
          <span className="text-xs text-zinc-600 tabular-nums text-right">
            {row.b_total.toLocaleString('nl-NL')}
          </span>
        </div>
      </div>
    </div>
  )
}
