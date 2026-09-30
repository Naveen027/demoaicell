import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Cpu, Search } from 'lucide-react'
import { api } from '../../services/api'
import { Badge, Empty, PageHeader, Spinner } from '../../components/ui'
import type { AIModel } from '../../types'

export default function UserModels() {
  const [models, setModels] = useState<AIModel[] | null>(null)
  const [params, setParams] = useSearchParams()
  const [cat, setCat] = useState('All')
  const q = params.get('q') ?? ''
  useEffect(() => { api.getModels().then(setModels) }, [])
  const cats = useMemo(() => ['All', ...new Set((models ?? []).map((m) => m.category))], [models])
  if (!models) return <Spinner />
  const list = models.filter((m) => (cat === 'All' || m.category === cat) && (m.name + m.description).toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHeader title="AI Models" sub="Pick a model and try it in the playground." />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={q} onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} placeholder="Search models…" className="input pl-10" /></div>
        <div className="flex flex-wrap gap-2">{cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${cat === c ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'}`}>{c}</button>)}</div>
      </div>
      {list.length === 0 ? <Empty text="No models match your search." /> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((m, i) => (
            <div key={m.id} className="card flex flex-col animate-fade-in transition hover:-translate-y-0.5 hover:shadow-md" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start justify-between gap-2"><div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${m.color} text-white`}><Cpu size={20} /></div><Badge tone={m.status === 'active' ? 'green' : 'slate'}>{m.status}</Badge></div>
              <h3 className="mt-4 font-semibold">{m.name} <span className="text-xs font-normal text-slate-400">{m.version}</span></h3>
              <p className="mt-1 flex-1 text-sm text-slate-500 dark:text-slate-400">{m.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>{m.category}</span><span>~{m.latency} ms</span></div>
              {m.status === 'active' ? <Link to={`/app/chat?model=${m.id}`} className="btn-primary mt-4">Try in playground</Link> : <button disabled className="btn-ghost mt-4">Unavailable</button>}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
