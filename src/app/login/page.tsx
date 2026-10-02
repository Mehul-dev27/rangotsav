'use client'
import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'
export default function Login() {
  const sb = supabaseBrowser(); const [email, setE] = useState(''); const [pw, setP] = useState(''); const [msg, setMsg] = useState('')
  const next = typeof window !== 'undefined' ? new URLSearchParams(location.search).get('next') ?? '/' : '/'
  const submit = async (signup: boolean) => {
    const { error } = signup ? await sb.auth.signUp({ email, password: pw, options: { emailRedirectTo: `${location.origin}/auth/callback?next=${next}` } }) : await sb.auth.signInWithPassword({ email, password: pw })
    if (error) setMsg(error.message); else if (signup) setMsg('Check your email to confirm.'); else location.href = next
  }
  const google = () => sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/auth/callback?next=${next}` } })
  return (<main className="mx-auto max-w-sm space-y-3 px-4 py-16"><h1 className="font-serif text-2xl">Sign in</h1>
    <input className="inp" placeholder="Email" value={email} onChange={(e) => setE(e.target.value)} /><input className="inp" type="password" placeholder="Password" value={pw} onChange={(e) => setP(e.target.value)} />
    <button onClick={() => submit(false)} className="btn-dark w-full">Sign in</button><button onClick={() => submit(true)} className="btn-line w-full">Create account</button><button onClick={google} className="btn-line w-full">Continue with Google</button>
    {msg && <p className="text-sm text-maroon">{msg}</p>}</main>)
}
