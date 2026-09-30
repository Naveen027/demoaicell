import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import UserDashboard from './pages/user/UserDashboard'
import UserModels from './pages/user/UserModels'
import Playground from './pages/user/Playground'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminModels from './pages/admin/AdminModels'
import type { Role } from './types'

function Guard({ role }: { role: Role }) {
  const { session } = useApp()
  if (!session) return <Navigate to="/login" replace />
  if (session.role !== role) return <Navigate to={session.role === 'admin' ? '/admin' : '/app'} replace />
  return <Layout role={role} />
}

export default function App() {
  const { session } = useApp()
  const home = session ? (session.role === 'admin' ? '/admin' : '/app') : '/login'
  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to={home} replace /> : <AuthPage mode="login" />} />
      <Route path="/signup" element={session ? <Navigate to={home} replace /> : <AuthPage mode="signup" />} />
      <Route path="/app" element={<Guard role="user" />}>
        <Route index element={<UserDashboard />} />
        <Route path="models" element={<UserModels />} />
        <Route path="chat" element={<Playground />} />
      </Route>
      <Route path="/admin" element={<Guard role="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="models" element={<AdminModels />} />
      </Route>
      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  )
}
