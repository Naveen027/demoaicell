import { useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, ChevronsLeft, ChevronsRight, Cpu, LayoutDashboard, LogOut, Menu, MessageSquare, Moon, Search, Sun, Users, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Role } from '../types'

const nav = {
  user: [{ to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true }, { to: '/app/models', label: 'Models', icon: Cpu }, { to: '/app/chat', label: 'Playground', icon: MessageSquare }],
  admin: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }, { to: '/admin/users', label: 'Users', icon: Users }, { to: '/admin/models', label: 'Models', icon: Cpu }],
}
const notes = ['New user Ananya Das signed up', 'Moto Embed was disabled', 'Weekly usage report is ready']

export default function Layout({ role }: { role: Role }) {
  const { session, setSession, theme, toggleTheme } = useApp()
  const [collapsed, setCollapsed] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [menu, setMenu] = useState<'none' | 'bell' | 'profile'>('none')
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const loc = useLocation()
  const base = role === 'admin' ? '/admin' : '/app'

  const search = (e: FormEvent) => { e.preventDefault(); navigate(`${base}/${role === 'admin' ? 'users' : 'models'}?q=${encodeURIComponent(q)}`) }
  const logout = () => { setSession(null); navigate('/login') }
  const initials = session?.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen">
      {mobile && <div className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={() => setMobile(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${mobile ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}>
        <Link to={base} className={`flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-5 dark:border-slate-800 ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white"><Zap size={18} /></div>
          <span className={`text-lg font-bold ${collapsed ? 'lg:hidden' : ''}`}>Moto AI</span>
        </Link>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className={`px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 ${collapsed ? 'lg:hidden' : ''}`}>{role === 'admin' ? 'Admin' : 'Workspace'}</p>
          {nav[role].map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} title={label} onClick={() => setMobile(false)}
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${collapsed ? 'lg:justify-center' : ''} ${isActive ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
              <Icon size={20} className="shrink-0" /><span className={collapsed ? 'lg:hidden' : ''}>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="space-y-1 border-t border-slate-200 p-3 dark:border-slate-800">
          <button onClick={() => setCollapsed((c) => !c)} title="Collapse" className={`hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:flex ${collapsed ? 'justify-center' : ''}`}>
            {collapsed ? <ChevronsRight size={20} /> : <><ChevronsLeft size={20} />Collapse</>}
          </button>
          <button onClick={logout} title="Log out" className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 ${collapsed ? 'lg:justify-center' : ''}`}>
            <LogOut size={20} className="shrink-0" /><span className={collapsed ? 'lg:hidden' : ''}>Log out</span>
          </button>
        </div>
      </aside>

      <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
          <button onClick={() => setMobile(true)} aria-label="Open menu" className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"><Menu size={20} /></button>
          <form onSubmit={search} className="relative min-w-0 max-w-md flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={role === 'admin' ? 'Search users…' : 'Search models…'} className="input pl-10" />
          </form>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-xl p-2.5 transition hover:bg-slate-100 dark:hover:bg-slate-800">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
            <div className="relative">
              <button onClick={() => setMenu(menu === 'bell' ? 'none' : 'bell')} aria-label="Notifications" className="relative rounded-xl p-2.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"><Bell size={18} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" /></button>
              {menu === 'bell' && <><div className="fixed inset-0" onClick={() => setMenu('none')} />
                <div className="card absolute right-0 z-10 mt-2 w-72 max-w-[calc(100vw-2rem)] animate-pop p-2"><p className="px-3 py-2 text-sm font-semibold">Notifications</p>{notes.map((n) => <p key={n} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">{n}</p>)}</div></>}
            </div>
            <div className="relative">
              <button onClick={() => setMenu(menu === 'profile' ? 'none' : 'profile')} className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-xs font-semibold text-white">{initials}</span>
                <span className="hidden max-w-[8rem] truncate text-sm font-medium sm:block">{session?.name}</span>
              </button>
              {menu === 'profile' && <><div className="fixed inset-0" onClick={() => setMenu('none')} />
                <div className="card absolute right-0 z-10 mt-2 w-56 animate-pop p-2"><div className="px-3 py-2"><p className="truncate text-sm font-semibold">{session?.name}</p><p className="truncate text-xs text-slate-500">{session?.email}</p></div>
                  <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"><LogOut size={16} />Log out</button></div></>}
            </div>
          </div>
        </header>
        <main key={loc.pathname} className="mx-auto w-full max-w-7xl animate-fade-in p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
