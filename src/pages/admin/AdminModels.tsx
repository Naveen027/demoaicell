import { useEffect, useState } from 'react'
import { Cpu } from 'lucide-react'
import { api } from '../../services/api'
import { Badge, PageHeader, Spinner } from '../../components/ui'
import type { AIModel } from '../../types'

export default function AdminModels() {
  const [models, setModels] = useState<AIModel[] | null>(null)
  useEffect(() => { api.getModels().then(setModels) }, [])
  if (!models) return <Spinner />
  return (
    <>
      <PageHeader title="Models" sub="Enable or disable models for all users." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {models.map((m) => (
          <div key={m.id} className="card">
            <div className="flex items-center gap-3"><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${m.color} text-white`}><Cpu size={20} /></div>
              <div className="min-w-0 flex-1"><p className="truncate font-semibold">{m.name}</p><p className="text-xs text-slate-500">{m.version} · {m.category}</p></div>
              <Badge tone={m.status === 'active' ? 'green' : 'slate'}>{m.status}</Badge></div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60"><p className="text-xs text-slate-500">Requests</p><p className="font-semibold">{m.requests.toLocaleString()}</p></div><div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60"><p className="text-xs text-slate-500">Latency</p><p className="font-semibold">{m.latency} ms</p></div></div>
            <button onClick={() => api.toggleModel(m.id).then(setModels)} className={`mt-4 w-full ${m.status === 'active' ? 'btn-ghost' : 'btn-primary'}`}>{m.status === 'active' ? 'Disable model' : 'Enable model'}</button>
          </div>
        ))}
      </div>
    </>
  )
}
