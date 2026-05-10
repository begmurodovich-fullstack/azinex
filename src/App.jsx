import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { AppShell } from './components/AppShell'
import { RequireAuth } from './components/RequireAuth'
import { Dashboard } from './pages/Dashboard'
import { AddExpense } from './pages/AddExpense'
import { ExpenseList } from './pages/ExpenseList'
import { Statistics } from './pages/Statistics'
import { Subscription } from './pages/Subscription'
import { Profile } from './pages/Profile'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route index element={<Dashboard />} />
              <Route path="add" element={<AddExpense />} />
              <Route path="expenses" element={<ExpenseList />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="profile" element={<Profile />} />
              <Route path="subscription" element={<Subscription />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
