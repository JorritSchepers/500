import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    console.log(req);
    const { round_id, jorritScore, jorritJokers, bodileScore, bodileJokers } =
        await req.json();


    const { error } = await supabase.from('round_score').insert([
        { round_id, player_id: 1, score: jorritScore, jokers: jorritJokers },
        { round_id, player_id: 2, score: bodileScore, jokers: bodileJokers },
    ]);

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}
