import { supabase } from '@/lib/supabase'
import RoundList from './components/RoundList'

export const dynamic = 'force-dynamic'

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
      <RoundList rounds={rounds ?? []} />
    </main>
  )
}