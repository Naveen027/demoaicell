import type { AIModel, AppUser } from '../types'
export const models: AIModel[] = [
  { id: 'chat', name: 'Moto Chat', category: 'Language', description: 'Conversational assistant for support, writing and Q&A.', version: 'v2.4', status: 'active', requests: 48210, latency: 820, color: 'from-indigo-500 to-violet-500' },
  { id: 'code', name: 'Moto Code', category: 'Language', description: 'Generates, explains and reviews code in 20+ languages.', version: 'v1.9', status: 'active', requests: 31544, latency: 940, color: 'from-emerald-500 to-teal-500' },
  { id: 'vision', name: 'Moto Vision', category: 'Vision', description: 'Image classification, OCR and object detection.', version: 'v3.1', status: 'active', requests: 18790, latency: 1200, color: 'from-orange-500 to-rose-500' },
  { id: 'voice', name: 'Moto Voice', category: 'Audio', description: 'Speech-to-text and natural text-to-speech.', version: 'v1.2', status: 'active', requests: 9320, latency: 1500, color: 'from-sky-500 to-cyan-500' },
  { id: 'translate', name: 'Moto Translate', category: 'Language', description: 'Fast, accurate translation across 40 languages.', version: 'v2.0', status: 'active', requests: 14005, latency: 430, color: 'from-fuchsia-500 to-pink-500' },
  { id: 'embed', name: 'Moto Embed', category: 'Data', description: 'Text embeddings for semantic search and clustering.', version: 'v1.5', status: 'disabled', requests: 6210, latency: 210, color: 'from-amber-500 to-yellow-500' },
]
export const users: AppUser[] = [
  ['u1', 'Aarav Sharma', 'aarav@acme.com', 'active', '2026-01-12', 1240, '2 min ago'],
  ['u2', 'Priya Nair', 'priya@acme.com', 'active', '2026-02-03', 980, '1 hr ago'],
  ['u3', 'Rohan Mehta', 'rohan@globex.io', 'suspended', '2026-02-20', 310, '12 days ago'],
  ['u4', 'Sneha Iyer', 'sneha@globex.io', 'active', '2026-03-08', 2210, 'Yesterday'],
  ['u5', 'Karthik Rao', 'karthik@initech.co', 'active', '2026-04-15', 655, '3 hrs ago'],
  ['u6', 'Divya Menon', 'divya@initech.co', 'active', '2026-05-30', 1490, '5 min ago'],
  ['u7', 'Vikram Singh', 'vikram@umbrella.com', 'suspended', '2026-06-18', 88, '30 days ago'],
  ['u8', 'Ananya Das', 'ananya@umbrella.com', 'active', '2026-08-02', 420, 'Today'],
].map(([id, name, email, status, joinedAt, requests, lastActive]) => ({ id, name, email, role: 'user', status, joinedAt, requests, lastActive }) as AppUser)
export const weeklyUsage = [42, 65, 51, 88, 73, 96, 60]
export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const activity = [
  { id: 1, text: 'Ran a prompt on Moto Chat', time: '2 min ago' },
  { id: 2, text: 'Analysed an image with Moto Vision', time: '1 hr ago' },
  { id: 3, text: 'Translated a document with Moto Translate', time: '3 hrs ago' },
  { id: 4, text: 'Reviewed code with Moto Code', time: 'Yesterday' },
]
export const credentials = [
  { email: 'admin@moto.ai', password: 'admin123', name: 'Admin', role: 'admin' as const, id: 'a1' },
  { email: 'user@moto.ai', password: 'user123', name: 'Demo User', role: 'user' as const, id: 'u0' },
]
