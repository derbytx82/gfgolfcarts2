import { Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

export function AdminLoginPage() {
  const { signIn, authError } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)

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

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResetError(null)
    setResetLoading(true)
    setResetSuccess(false)

    try {
      await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/update-password`
      })

      setResetSuccess(true)
      setResetEmail('')
    } catch (requestError) {
      setResetError(requestError instanceof Error ? requestError.message : 'Unable to send reset password email')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-radial px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-surface-900/85 p-6 shadow-premium sm:p-8">
        {!showResetPassword ? (
          <>
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

              <div className="flex justify-between items-center">
                <Button type="submit" fullWidth size="lg" disabled={loading}>
                  {loading ? 'Signing in...' : 'Login'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowResetPassword(true)}
                  className="text-xs"
                >
                  Forgot Password?
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.18em] text-accent-gold">Reset Password</p>
            <h1 className="mt-2 font-display text-3xl text-white">Reset Your Password</h1>
            <p className="mt-2 text-sm text-surface-300">
              Enter your email address to receive a password reset link.
            </p>

            {resetSuccess ? (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  Password reset email sent! Please check your inbox (and spam folder) for instructions to reset your password.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
                <label className="relative block">
                  <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={resetEmail}
                    onChange={(event) => setResetEmail(event.target.value)}
                    className="pl-10"
                    required
                  />
                </label>

                {resetError && <p className="text-sm text-red-300">{resetError}</p>}

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={resetLoading}
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            )}

            <div className="mt-4 text-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowResetPassword(false)}
              >
                Back to Login
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}