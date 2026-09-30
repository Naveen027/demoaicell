export type Role = 'admin' | 'user'
export interface AIModel { id: string; name: string; category: string; description: string; version: string; status: 'active' | 'disabled'; requests: number; latency: number; color: string }
export interface AppUser { id: string; name: string; email: string; role: Role; status: 'active' | 'suspended'; joinedAt: string; requests: number; lastActive: string }
export interface Session { id: string; name: string; email: string; role: Role }
export interface ChatMsg { id: number; from: 'user' | 'ai'; text: string }
