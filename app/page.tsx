import { supabase } from '@/lib/supabase'
import RoundList from './components/RoundList'

export default async function Home() {
  const { data: rounds, error } = await supabase
    .from('score_view')
    .select('*')
    .order('round_id', { ascending: false })
    .limit(50)

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <p className="text-sm text-zinc-500">Fout bij laden: {error.message}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950 border-b border-zinc-800">
        <div className="grid grid-cols-[3rem_1fr_auto_1fr] px-4 py-4">
          <div />
          <div className="text-sm font-semibold text-emerald-400 tracking-wide">Jorrit</div>
          <div className="text-xs text-zinc-600 self-center px-3">vs</div>
          <div className="text-sm font-semibold text-fuchsia-400 tracking-wide text-right">Bodile</div>
        </div>
      </div>

      <RoundList rounds={rounds ?? []} />
    </main>
  )
}