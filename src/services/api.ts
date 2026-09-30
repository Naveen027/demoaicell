// Every function returns hardcoded data through a fake delay.
// When your backend is ready, replace each function body with a fetch()/axios call.
import { models, users, credentials, weeklyUsage, activity } from '../data/mock'
import type { AIModel, AppUser, Session, Role } from '../types'

const wait = <T,>(v: T, ms = 350) => new Promise<T>((r) => setTimeout(() => r(v), ms))
let modelStore: AIModel[] = [...models]
let userStore: AppUser[] = [...users]
const accounts = [...credentials]

export const api = {
  async login(email: string, password: string, role: Role): Promise<Session> {
    const a = accounts.find((c) => c.email === email.toLowerCase() && c.password === password && c.role === role)
    if (!a) throw new Error('Invalid credentials for this account type.')
    return wait({ id: a.id, name: a.name, email: a.email, role: a.role })
  },
  async signup(name: string, email: string, password: string, role: Role): Promise<Session> {
    if (accounts.some((c) => c.email === email.toLowerCase())) throw new Error('An account with this email already exists.')
    const id = 'n' + Date.now()
    accounts.push({ id, name, email: email.toLowerCase(), password, role })
    if (role === 'user') userStore = [{ id, name, email, role, status: 'active', joinedAt: new Date().toISOString().slice(0, 10), requests: 0, lastActive: 'Just now' }, ...userStore]
    return wait({ id, name, email, role })
  },
  getModels: () => wait([...modelStore]),
  getUsers: () => wait([...userStore]),
  getWeeklyUsage: () => wait(weeklyUsage),
  getActivity: () => wait(activity),
  async toggleUser(id: string) { userStore = userStore.map((u) => (u.id === id ? ({ ...u, status: u.status === 'active' ? 'suspended' : 'active' } as AppUser) : u)); return wait([...userStore], 150) },
  async deleteUser(id: string) { userStore = userStore.filter((u) => u.id !== id); return wait([...userStore], 150) },
  async toggleModel(id: string) { modelStore = modelStore.map((m) => (m.id === id ? ({ ...m, status: m.status === 'active' ? 'disabled' : 'active' } as AIModel) : m)); return wait([...modelStore], 150) },
  async chat(modelName: string, prompt: string) {
    return wait(`${modelName} here. You asked: "${prompt}". This is a hardcoded reply. Connect your inference endpoint in services/api.ts.`, 900)
  },
}
