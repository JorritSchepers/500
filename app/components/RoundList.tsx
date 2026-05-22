'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { SwipeableRow } from './SwipeableRow'
import { ConfirmDeleteModal } from './ConfirmDeleteModal'
import { FloatingButton } from './FloatingButton'
import { FormState, NewRoundModal } from './NewRoundModal'

export default function RoundList({ rounds }: { rounds: RoundRow[] }) {
  const router = useRouter()
  const [openNewRoundModal, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [roundIdToDelete, setConfirmDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState<FormState>({
    jorritScore: '',
    jorritJokers: '0',
    bodileScore: '',
    bodileJokers: '0',
  })

  const nextRound = (rounds[0]?.round_id ?? 0) + 1

  const first = rounds[0]
  const jorritTotal = first?.j_total ?? 0
  const bodileTotal = first?.b_total ?? 0

  async function handleSave() {
    const jScore = parseInt(form.jorritScore)
    const bScore = parseInt(form.bodileScore)
    const jJokers = parseInt(form.jorritJokers) || 0
    const bJokers = parseInt(form.bodileJokers) || 0

    if (isNaN(jScore) || isNaN(bScore)) return

    setSaving(true)
    try {
      await supabase.from('round_score').insert([
        { round_id: nextRound, player_id: 1, score: jScore, jokers: jJokers },
        { round_id: nextRound, player_id: 2, score: bScore, jokers: bJokers },
      ])

      setOpen(false)
      setForm({ jorritScore: '', jorritJokers: '0', bodileScore: '', bodileJokers: '0' })
      router.refresh()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  async function handleConfirmDelete() {
    if (roundIdToDelete === null) return
    setDeleting(true)
    try {
      await supabase.from('round').delete().eq('id', roundIdToDelete)
      setConfirmDeleteId(null)
      router.refresh()
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(false)
    }
  }

  function jokerString(jokers: number) {
    return `${jokers} joker${jokers > 1 ? 's' : ''} `
  }

  function getOpenNewRoundModal() {
    return (
      <NewRoundModal
        form={form}
        setForm={setForm}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        saving={saving}
        nextRound={nextRound}
      />
    )
  }

  if (rounds.length === 0 && !openNewRoundModal) {
    return (
      <>
        <div className="flex items-center justify-center py-20 text-zinc-600 text-sm">
          Geen rondes gevonden
        </div>
        <FloatingButton onClick={() => setOpen(true)} />
        {openNewRoundModal && getOpenNewRoundModal()}
      </>
    )
  }

  return (
    <>
      {/* Totals */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-[3rem_1fr_auto_1fr] items-center">
          <div />
          <div className="text-emerald-400">
            <p className="text-[16px] uppercase tracking-widest mb-1">Jorrit</p>
            <p className="text-xl font-semibold tabular-nums">
              {jorritTotal.toLocaleString('nl-NL')}
            </p>
          </div>
          <div className="px-3 text-center">
            <span
              className={`text-[16px] font-semibold tracking-widest ${jorritTotal > bodileTotal ? 'text-emerald-400' : 'text-fuchsia-400'
                }`}
            >
              {Math.abs(jorritTotal - bodileTotal)}
            </span>
          </div>
          <div className="text-right text-fuchsia-400">
            <p className="text-[16px] uppercase tracking-widest mb-1">Bodile</p>
            <p className="text-xl font-semibold tabular-nums">
              {bodileTotal.toLocaleString('nl-NL')}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-zinc-900">
        {rounds.map((row) => (
          <SwipeableRow
            key={row.round_id}
            row={row}
            jokerString={jokerString}
            onDeleteRequest={() => setConfirmDeleteId(row.round_id)}
          />
        ))}
      </div>

      <FloatingButton onClick={() => setOpen(true)} />

      {openNewRoundModal && getOpenNewRoundModal()}

      {roundIdToDelete !== null && (
        <ConfirmDeleteModal
          roundId={roundIdToDelete}
          deleting={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </>
  )
}
