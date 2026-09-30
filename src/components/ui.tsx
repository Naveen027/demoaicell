import { X, type LucideIcon } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0"><h1 className="text-2xl font-bold tracking-tight">{title}</h1>{sub && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{sub}</p>}</div>
      {action}
    </div>
  )
}
export function StatCard({ label, value, icon: Icon, delay = 0 }: { label: string; value: string; icon: LucideIcon; delay?: number }) {
  return (
    <div className="card flex items-center gap-4 animate-fade-in hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: `${delay}ms` }}>
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"><Icon size={22} /></div>
      <div className="min-w-0"><p className="truncate text-sm text-slate-500 dark:text-slate-400">{label}</p><p className="text-2xl font-bold">{value}</p></div>
    </div>
  )
}
export function Badge({ tone, children }: { tone: 'green' | 'red' | 'slate'; children: ReactNode }) {
  const t = { green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400', red: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400', slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' }[tone]
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${t}`}>{children}</span>
}
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => { const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [onClose])
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="card relative max-h-[90vh] w-full max-w-md animate-pop overflow-y-auto">
        <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold">{title}</h3><button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button></div>
        {children}
      </div>
    </div>
  )
}
export const Spinner = () => <div className="grid place-items-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" /></div>
export const Empty = ({ text }: { text: string }) => <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">{text}</p>
