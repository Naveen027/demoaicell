import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Bot, Send, Trash2 } from 'lucide-react'
import { api } from '../../services/api'
import { PageHeader, Spinner } from '../../components/ui'
import type { AIModel, ChatMsg } from '../../types'

export default function Playground() {
  const [models, setModels] = useState<AIModel[]>([])
  const [params, setParams] = useSearchParams()
  const [msgs, setMsgs] = useState<ChatMsg[]>([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { api.getModels().then((m) => setModels(m.filter((x) => x.status === 'active'))) }, [])
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, busy])
  if (!models.length) return <Spinner />
  const current = models.find((m) => m.id === params.get('model')) ?? models[0]

  const send = async (e: FormEvent) => {
    e.preventDefault()
    const prompt = text.trim(); if (!prompt || busy) return
    setMsgs((m) => [...m, { id: Date.now(), from: 'user', text: prompt }]); setText(''); setBusy(true)
    const reply = await api.chat(current.name, prompt)
    setMsgs((m) => [...m, { id: Date.now() + 1, from: 'ai', text: reply }]); setBusy(false)
  }
  return (
    <>
      <PageHeader title="Playground" sub="Test any model with your own prompts." action={
        <div className="flex gap-2">
          <select value={current.id} onChange={(e) => { setParams({ model: e.target.value }); setMsgs([]) }} className="input !w-auto min-w-0 flex-1 sm:flex-none">{models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
          <button onClick={() => setMsgs([])} aria-label="Clear chat" className="btn-ghost !px-3"><Trash2 size={16} /></button>
        </div>} />
      <div className="card flex h-[calc(100vh-15rem)] min-h-[380px] flex-col !p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {msgs.length === 0 && <div className="grid h-full place-items-center text-center"><div><div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${current.color} text-white`}><Bot /></div><p className="mt-4 font-medium">Chat with {current.name}</p><p className="text-sm text-slate-500">Type a message below to begin.</p></div></div>}
          {msgs.map((m) => (
            <div key={m.id} className={`flex animate-pop ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <p className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm sm:max-w-[70%] ${m.from === 'user' ? 'rounded-br-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white' : 'rounded-bl-md bg-slate-100 dark:bg-slate-800'}`}>{m.text}</p>
            </div>
          ))}
          {busy && <div className="flex gap-1 px-2">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${i * 120}ms` }} />)}</div>}
          <div ref={end} />
        </div>
        <form onSubmit={send} className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-800 sm:p-4">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={`Message ${current.name}…`} className="input" />
          <button disabled={busy || !text.trim()} className="btn-primary !px-4" aria-label="Send"><Send size={16} /></button>
        </form>
      </div>
    </>
  )
}
