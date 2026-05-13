'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type RoundScore = {
  id: number
  round_id: number
  player_id: number
  score: number
  jokers: number
}

type RoundPair = {
  round_id: number
  jorrit: RoundScore | null
  bodile: RoundScore | null
}

type FormState = {
  jorritScore: string
  jorritJokers: string
  bodileScore: string
  bodileJokers: string
}

export default function RoundList({ rounds }: { rounds: RoundScore[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>({
    jorritScore: '',
    jorritJokers: '0',
    bodileScore: '',
    bodileJokers: '0',
  })

  const roundMap = new Map<number, RoundPair>()
  for (const r of rounds) {
    if (!roundMap.has(r.round_id)) {
      roundMap.set(r.round_id, { round_id: r.round_id, jorrit: null, bodile: null })
    }
    const pair = roundMap.get(r.round_id)!
    if (r.player_id === 1) pair.jorrit = r
    else pair.bodile = r
  }

  const pairs = Array.from(roundMap.values()).sort((a, b) => a.round_id - b.round_id)
  const nextRound = (pairs[pairs.length - 1]?.round_id ?? 0) + 1

  let jorritTotal = 0
  let bodileTotal = 0

  async function handleSave() {
    const jScore = parseInt(form.jorritScore)
    const bScore = parseInt(form.bodileScore)
    const jJokers = parseInt(form.jorritJokers) || 0
    const bJokers = parseInt(form.bodileJokers) || 0

    if (isNaN(jScore) || isNaN(bScore)) return

    setSaving(true)
    try {
      var newRoundN = rounds.length + 1

      await supabase.from('round_score').insert([
        { round_id: newRoundN, player_id: 1, score: jScore, jokers: jJokers },
        { round_id: newRoundN, player_id: 2, score: bScore, jokers: bJokers },
      ]);

      setOpen(false)
      setForm({ jorritScore: '', jorritJokers: '0', bodileScore: '', bodileJokers: '0' })
      router.refresh()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (rounds.length === 0 && !open) {
    return (
      <>
        <div className="flex items-center justify-center py-20 text-zinc-600 text-sm">
          Geen rondes gevonden
        </div>
        <FloatingButton onClick={() => setOpen(true)} />
        {open && <Modal form={form} setForm={setForm} onClose={() => setOpen(false)} onSave={handleSave} saving={saving} nextRound={nextRound} />}
      </>
    )
  }

  return (
    <>
      <div>
        <div className="divide-y divide-zinc-900">
          {pairs.map((pair) => {
            const jScore = pair.jorrit?.score ?? 0
            const bScore = pair.bodile?.score ?? 0
            const jJokers = pair.jorrit?.jokers ?? 0
            const bJokers = pair.bodile?.jokers ?? 0

            jorritTotal += jScore
            bodileTotal += bScore

            const jLeads = jScore > bScore
            const bLeads = bScore > jScore

            return (
              <div key={pair.round_id} className="grid grid-cols-[3rem_1fr_auto_1fr] items-center px-4 py-3">
                <span className="text-xs text-zinc-600 tabular-nums">{pair.round_id}</span>

                <div className="flex flex-col gap-0.5">
                  <span className={`text-base font-semibold tabular-nums ${jScore < 0 ? 'text-red-400' : jLeads ? 'text-emerald-400' : 'text-zinc-300'
                    }`}>
                    {jScore > 0 ? `+${jScore}` : jScore}
                    {jJokers > 0 && <span className="ml-1.5 text-[10px] font-normal text-amber-500 tracking-wide">×{jJokers}</span>}
                  </span>
                  <span className="text-xs text-zinc-600 tabular-nums">{jorritTotal.toLocaleString('nl-NL')}</span>
                </div>

                <div className="px-3 text-center">
                  <span className={`text-[11px] tabular-nums font-medium ${jScore > bScore ? 'text-emerald-500' : bScore > jScore ? 'text-fuchsia-500' : 'text-zinc-700'
                    }`}>
                    {jScore === bScore ? '—' : jLeads ? `+${jScore - bScore}` : `+${bScore - jScore}`}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 items-end">
                  <span className={`text-base font-semibold tabular-nums ${bScore < 0 ? 'text-red-400' : bLeads ? 'text-fuchsia-400' : 'text-zinc-300'
                    }`}>
                    {bScore > 0 ? `+${bScore}` : bScore}
                    {bJokers > 0 && <span className="ml-1.5 text-[10px] font-normal text-amber-500 tracking-wide">×{bJokers}</span>}
                  </span>
                  <span className="text-xs text-zinc-600 tabular-nums text-right">{bodileTotal.toLocaleString('nl-NL')}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Totals footer */}
        <div className="sticky bottom-0 bg-zinc-950 border-t border-zinc-800 px-4 py-4">
          <div className="grid grid-cols-[3rem_1fr_auto_1fr] items-center">
            <div />
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Jorrit</p>
              <p className='text-xl font-semibold tabular-nums text-emerald-400'>
                {jorritTotal.toLocaleString('nl-NL')}
              </p>
            </div>
            <div className="px-3 text-center">
              <span className="text-[10px] text-zinc-700 uppercase tracking-widest">totaal</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Bodile</p>
              <p className='text-xl font-semibold tabular-nums text-fuchsia-400'>
                {bodileTotal.toLocaleString('nl-NL')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <FloatingButton onClick={() => setOpen(true)} />
      {open && <Modal form={form} setForm={setForm} onClose={() => setOpen(false)} onSave={handleSave} saving={saving} nextRound={nextRound} />}
    </>
  )
}

function FloatingButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-20 w-14 h-14 rounded-full bg-white text-zinc-950 flex items-center justify-center text-2xl font-light hover:scale-105 active:scale-95 transition-transform shadow-none"
      aria-label="Ronde toevoegen"
    >
      +
    </button>
  )
}

function Modal({
  form, setForm, onClose, onSave, saving, nextRound
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-black/70"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900 rounded-t-2xl px-5 pt-5 pb-8 border-t border-zinc-800">

        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-zinc-700 mx-auto mb-5" />

        {/* Title */}
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-base font-semibold text-white">Ronde {nextRound}</h2>
          <button onClick={onClose} className="text-zinc-500 text-sm hover:text-zinc-300">annuleer</button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Jorrit */}
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

          {/* Bodile */}
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