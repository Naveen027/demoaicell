import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Moon, ShieldCheck, Sun, User, Zap } from 'lucide-react'
import { api } from '../services/api'
import { useApp } from '../context/AppContext'
import type { Role } from '../types'

export default function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const { setSession, theme, toggleTheme } = useApp()
  const navigate = useNavigate()
  const [role, setRole] = useState<Role>('user')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isLogin = mode === 'login'

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError('')
    if (!isLogin && password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      const s = isLogin ? await api.login(email, password, role) : await api.signup(name, email, password, role)
      setSession(s); navigate(s.role === 'admin' ? '/admin' : '/app')
    } catch (err) { setError((err as Error).message) } finally { setLoading(false) }
  }
  const fill = (r: Role) => { setRole(r); setEmail(r === 'admin' ? 'admin@moto.ai' : 'user@moto.ai'); setPassword(r === 'admin' ? 'admin123' : 'user123') }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" /><div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-3 text-xl font-bold"><Zap />Moto AI</div>
        <div className="relative"><h2 className="text-4xl font-bold leading-tight">Six AI models.<br />One simple platform.</h2><p className="mt-4 max-w-md text-white/80">Chat, code, vision, voice, translation and embeddings, all built in-house and ready to use.</p></div>
        <p className="relative text-sm text-white/60">© 2026 Moto AI</p>
      </div>
      <div className="relative flex items-center justify-center p-4 sm:p-8">
        <button onClick={toggleTheme} aria-label="Toggle theme" className="absolute right-4 top-4 rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 sm:right-6 sm:top-6">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
        <div className="w-full max-w-md animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{isLogin ? 'Sign in to continue to Moto AI.' : 'Get started with Moto AI in a minute.'}</p>
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {(['user', 'admin'] as Role[]).map((r) => (
              <button key={r} type="button" onClick={() => (isLogin ? fill(r) : setRole(r))} className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium capitalize transition ${role === r ? 'bg-white shadow-sm dark:bg-slate-700' : 'text-slate-500'}`}>
                {r === 'admin' ? <ShieldCheck size={16} /> : <User size={16} />}{r}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {!isLogin && <div><label className="mb-1.5 block text-sm font-medium">Full name</label><input required value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Jane Doe" /></div>}
            <div><label className="mb-1.5 block text-sm font-medium">Email</label><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@company.com" /></div>
            <div><label className="mb-1.5 block text-sm font-medium">Password</label>
              <div className="relative"><input required type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input pr-11" placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)} aria-label="Show password" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
            {error && <p className="animate-pop rounded-xl bg-rose-50 px-3.5 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10">{error}</p>}
            <button disabled={loading} className="btn-primary w-full">{loading && <Loader2 size={16} className="animate-spin" />}{isLogin ? 'Sign in' : 'Create account'}</button>
          </form>
          {isLogin && <p className="mt-4 rounded-xl bg-slate-100 px-3.5 py-2.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">Demo: tap User or Admin above to auto-fill credentials.</p>}
          <p className="mt-6 text-center text-sm text-slate-500">{isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link to={isLogin ? '/signup' : '/login'} className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">{isLogin ? 'Sign up' : 'Sign in'}</Link></p>
        </div>
      </div>
    </div>
  )
}
