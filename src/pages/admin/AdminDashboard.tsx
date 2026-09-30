import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Cpu, UserCheck, Users } from 'lucide-react'
import { api } from '../../services/api'
import { Badge, PageHeader, Spinner, StatCard } from '../../components/ui'
import type { AIModel, AppUser } from '../../types'

export default function AdminDashboard() {
  const [users, setUsers] = useState<AppUser[] | null>(null)
  const [models, setModels] = useState<AIModel[]>([])
  useEffect(() => { Promise.all([api.getUsers(), api.getModels()]).then(([u, m]) => { setUsers(u); setModels(m) }) }, [])
  if (!users) return <Spinner />
  const total = models.reduce((s, m) => s + m.requests, 0)
  return (
    <>
      <PageHeader title="Admin Dashboard" sub="Overview of users and model usage." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={String(users.length)} icon={Users} />
        <StatCard label="Active users" value={String(users.filter((u) => u.status === 'active').length)} icon={UserCheck} delay={60} />
        <StatCard label="Active models" value={`${models.filter((m) => m.status === 'active').length}/${models.length}`} icon={Cpu} delay={120} />
        <StatCard label="Total requests" value={total.toLocaleString()} icon={Activity} delay={180} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-semibold">Requests by model</h2>
          <div className="mt-5 space-y-4">
            {models.map((m) => (
              <div key={m.id}><div className="mb-1.5 flex justify-between text-sm"><span className="truncate">{m.name}</span><span className="text-slate-500">{m.requests.toLocaleString()}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-700`} style={{ width: `${(m.requests / Math.max(...models.map((x) => x.requests))) * 100}%` }} /></div></div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between"><h2 className="font-semibold">Recent signups</h2><Link to="/admin/users" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">View all</Link></div>
          <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {users.slice(0, 5).map((u) => (
              <li key={u.id} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600 dark:bg-indigo-500/10">{u.name[0]}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{u.name}</p><p className="truncate text-xs text-slate-500">{u.email}</p></div>
                <Badge tone={u.status === 'active' ? 'green' : 'red'}>{u.status}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
