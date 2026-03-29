import { Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'

export function AdminLoginPage() {
  const { signIn, authError } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/golfpanel')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-radial px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-surface-900/85 p-6 shadow-premium sm:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-accent-gold">Admin Access</p>
        <h1 className="mt-2 font-display text-3xl text-white">GF Dashboard Login</h1>
        <p className="mt-2 text-sm text-surface-300">Sign in to manage products, content and settings.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="relative block">
            <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="pl-10"
              required
            />
          </label>
          <label className="relative block">
            <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="pl-10"
              required
            />
          </label>

          {(error || authError) && <p className="text-sm text-red-300">{error || authError}</p>}

          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  )
}