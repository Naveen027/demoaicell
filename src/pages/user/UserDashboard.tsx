import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowRight, Clock, Cpu, Zap } from 'lucide-react'
import { api } from '../../services/api'
import { days } from '../../data/mock'
import { PageHeader, Spinner, StatCard } from '../../components/ui'
import { useApp } from '../../context/AppContext'
import type { AIModel } from '../../types'

export default function UserDashboard() {
  const { session } = useApp()
  const [usage, setUsage] = useState<number[]>([])
  const [act, setAct] = useState<{ id: number; text: string; time: string }[]>([])
  const [models, setModels] = useState<AIModel[]>([])
  useEffect(() => { Promise.all([api.getWeeklyUsage(), api.getActivity(), api.getModels()]).then(([u, a, m]) => { setUsage(u); setAct(a); setModels(m) }) }, [])
  if (!usage.length) return <Spinner />
  const max = Math.max(...usage)
  return (
    <>
      <PageHeader title={`Hello, ${session?.name.split(' ')[0]} 👋`} sub="Here's how your AI usage looks this week." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Requests today" value="96" icon={Activity} />
        <StatCard label="Tokens used" value="184K" icon={Zap} delay={60} />
        <StatCard label="Models available" value={String(models.filter((m) => m.status === 'active').length)} icon={Cpu} delay={120} />
        <StatCard label="Avg. latency" value="0.9s" icon={Clock} delay={180} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="font-semibold">Requests this week</h2>
          <div className="mt-6 flex h-56 items-end gap-2 sm:gap-4">
            {usage.map((v, i) => (
              <div key={i} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs text-slate-400 opacity-0 transition group-hover:opacity-100">{v}</span>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-500 transition-all duration-700 group-hover:opacity-80" style={{ height: `${(v / max) * 100}%` }} />
                <span className="text-xs text-slate-500">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="font-semibold">Recent activity</h2>
          <ul className="mt-4 space-y-4">{act.map((a) => (<li key={a.id} className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" /><div className="min-w-0"><p className="text-sm">{a.text}</p><p className="text-xs text-slate-400">{a.time}</p></div></li>))}</ul>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between"><h2 className="font-semibold">Quick launch</h2><Link to="/app/models" className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">All models <ArrowRight size={14} /></Link></div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {models.filter((m) => m.status === 'active').slice(0, 3).map((m) => (
          <Link key={m.id} to={`/app/chat?model=${m.id}`} className="card group flex items-center gap-4 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${m.color} text-white`}><Cpu size={20} /></div>
            <div className="min-w-0"><p className="truncate font-medium">{m.name}</p><p className="truncate text-xs text-slate-500">{m.category}</p></div>
            <ArrowRight size={16} className="ml-auto shrink-0 text-slate-400 transition group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </>
  )
}
