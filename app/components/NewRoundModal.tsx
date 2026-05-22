export type FormState = {
  jorritScore: string
  jorritJokers: string
  bodileScore: string
  bodileJokers: string
}

export function NewRoundModal({
  form, setForm, onClose, onSave, saving, nextRound,
}: {
  form: FormState
  setForm: (f: FormState) => void
  onClose: () => void
  onSave: () => void
  saving: boolean
  nextRound: number
}) {
  function field(key: keyof FormState, value: string) {
    setForm({ ...form, [key]: value })
  }

  const canSave = form.jorritScore !== '' && form.bodileScore !== ''

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/70" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900 rounded-t-2xl px-5 pt-5 pb-8 border-t border-zinc-800">
        <div className="w-10 h-1 rounded-full bg-zinc-700 mx-auto mb-5" />
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-base font-semibold text-white">Ronde {nextRound}</h2>
          <button onClick={onClose} className="text-zinc-500 text-sm hover:text-zinc-300">annuleer</button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-emerald-400 font-medium uppercase tracking-widest mb-3">Jorrit</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] text-zinc-500 block mb-1">Punten</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={form.jorritScore}
                  onChange={e => field('jorritScore', e.target.value)}
                  placeholder="0"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 block mb-1">Jokers</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={form.jorritJokers}
                  onChange={e => field('jorritJokers', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-fuchsia-400 font-medium uppercase tracking-widest mb-3">Bodile</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] text-zinc-500 block mb-1">Punten</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={form.bodileScore}
                  onChange={e => field('bodileScore', e.target.value)}
                  placeholder="0"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-fuchsia-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 block mb-1">Jokers</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={form.bodileJokers}
                  onChange={e => field('bodileJokers', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-fuchsia-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onSave}
          disabled={!canSave || saving}
          className="w-full bg-white text-zinc-950 rounded-xl py-3.5 text-sm font-semibold disabled:opacity-30 hover:bg-zinc-100 active:scale-[0.98] transition-all"
        >
          {saving ? 'Opslaan…' : 'Opslaan'}
        </button>
      </div>
    </>
  )
}