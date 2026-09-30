import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Ban, CheckCircle2, Eye, Search, Trash2 } from 'lucide-react'
import { api } from '../../services/api'
import { Badge, Empty, Modal, PageHeader, Spinner } from '../../components/ui'
import type { AppUser } from '../../types'

export default function AdminUsers() {
  const [users, setUsers] = useState<AppUser[] | null>(null)
  const [params, setParams] = useSearchParams()
  const [status, setStatus] = useState('all')
  const [view, setView] = useState<AppUser | null>(null)
  const [del, setDel] = useState<AppUser | null>(null)
  const q = params.get('q') ?? ''
  useEffect(() => { api.getUsers().then(setUsers) }, [])
  if (!users) return <Spinner />
  const list = users.filter((u) => (status === 'all' || u.status === status) && (u.name + u.email).toLowerCase().includes(q.toLowerCase()))
  const btn = 'rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800'
  return (
    <>
      <PageHeader title="Users" sub={`${users.length} registered users`} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-xs"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={q} onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })} placeholder="Search by name or email…" className="input pl-10" /></div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input sm:!w-40"><option value="all">All status</option><option value="active">Active</option><option value="suspended">Suspended</option></select>
      </div>
      <div className="card overflow-hidden !p-0">
        {list.length === 0 ? <Empty text="No users found." /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50"><tr>{['User', 'Status', 'Requests', 'Last active', ''].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {list.map((u) => (
                  <tr key={u.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3"><p className="font-medium">{u.name}</p><p className="text-xs text-slate-500">{u.email}</p></td>
                    <td className="px-5 py-3"><Badge tone={u.status === 'active' ? 'green' : 'red'}>{u.status}</Badge></td>
                    <td className="px-5 py-3">{u.requests.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-slate-500">{u.lastActive}</td>
                    <td className="px-5 py-3"><div className="flex justify-end gap-1">
                      <button className={btn} title="View" onClick={() => setView(u)}><Eye size={16} /></button>
                      <button className={btn} title={u.status === 'active' ? 'Suspend' : 'Activate'} onClick={() => api.toggleUser(u.id).then(setUsers)}>{u.status === 'active' ? <Ban size={16} className="text-amber-600" /> : <CheckCircle2 size={16} className="text-emerald-600" />}</button>
                      <button className={btn} title="Delete" onClick={() => setDel(u)}><Trash2 size={16} className="text-rose-600" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {view && <Modal title="User details" onClose={() => setView(null)}>
        <dl className="space-y-3 text-sm">{([['Name', view.name], ['Email', view.email], ['Status', view.status], ['Joined', view.joinedAt], ['Total requests', view.requests.toLocaleString()], ['Last active', view.lastActive]] as const).map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-slate-500">{k}</dt><dd className="truncate font-medium capitalize">{v}</dd></div>)}</dl></Modal>}
      {del && <Modal title="Delete user?" onClose={() => setDel(null)}>
        <p className="text-sm text-slate-500">This will remove <b>{del.name}</b> permanently.</p>
        <div className="mt-5 flex justify-end gap-2"><button className="btn-ghost" onClick={() => setDel(null)}>Cancel</button><button className="btn bg-rose-600 text-white hover:bg-rose-700" onClick={() => { api.deleteUser(del.id).then(setUsers); setDel(null) }}>Delete</button></div></Modal>}
    </>
  )
}
