import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '../types'

type Theme = 'light' | 'dark'
interface Ctx { theme: Theme; toggleTheme: () => void; session: Session | null; setSession: (s: Session | null) => void }
const AppCtx = createContext<Ctx>(null!)
export const useApp = () => useContext(AppCtx)

const read = <T,>(k: string): T | null => { try { return JSON.parse(localStorage.getItem(k) ?? 'null') } catch { return null } }

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => read<Theme>('moto-theme') ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  const [session, setSessionState] = useState<Session | null>(() => read<Session>('moto-session'))
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); localStorage.setItem('moto-theme', JSON.stringify(theme)) }, [theme])
  const setSession = (s: Session | null) => { setSessionState(s); if (s) localStorage.setItem('moto-session', JSON.stringify(s)); else localStorage.removeItem('moto-session') }
  return <AppCtx.Provider value={{ theme, toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), session, setSession }}>{children}</AppCtx.Provider>
}
