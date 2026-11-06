import { useEffect, useState, type FormEvent } from 'react'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase, supabaseConfigured } from '../lib/supabase'

type RecoveryStatus = 'loading' | 'ready' | 'invalid' | 'unauthorized'

const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase()

function isAuthorizedAdmin(user: User | null) {
  return Boolean(
    user
    && adminEmail
    && user.email?.toLowerCase() === adminEmail
    && user.app_metadata.role === 'admin',
  )
}

function hasRecoveryCallback() {
  const search = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.slice(1))
  return Boolean(search.has('code') || search.get('type') === 'recovery' || hash.get('type') === 'recovery')
}

function clearAuthCallbackFromUrl() {
  window.history.replaceState(window.history.state, '', window.location.pathname)
}

export function AdminPasswordReset() {
  const location = useLocation()
  const navigate = useNavigate()
  const callbackInUrl = hasRecoveryCallback()
  const recoverySessionEstablished = Boolean(
    (location.state as { recoverySessionEstablished?: boolean } | null)?.recoverySessionEstablished,
  )
  const [status, setStatus] = useState<RecoveryStatus>(() => (
    supabaseConfigured && supabase && (callbackInUrl || recoverySessionEstablished) ? 'loading' : 'invalid'
  ))
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)
  const [error, setError] = useState(() => {
    if (!supabaseConfigured || !supabase) return 'Password recovery is not configured. Contact the site administrator.'
    return callbackInUrl || recoverySessionEstablished
      ? ''
      : 'This recovery link is invalid, expired, or already used. Request a new password recovery email.'
  })
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const client = supabase
    if (!client || (!callbackInUrl && !recoverySessionEstablished)) return

    let active = true
    let timeout: number | undefined
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      if (!active) return

      if (event === 'PASSWORD_RECOVERY') {
        if (timeout !== undefined) window.clearTimeout(timeout)
        clearAuthCallbackFromUrl()
        if (isAuthorizedAdmin(session?.user ?? null)) {
          setError('')
          setStatus('ready')
        } else {
          setStatus('unauthorized')
          window.setTimeout(() => { void client.auth.signOut() }, 0)
        }
      }
    })

    if (recoverySessionEstablished) {
      void client.auth.getSession().then(({ data, error: sessionError }) => {
        if (!active) return
        if (sessionError) {
          setError(sessionError.message)
          setStatus('invalid')
        } else if (isAuthorizedAdmin(data.session?.user ?? null)) {
          setStatus('ready')
        } else {
          setStatus('unauthorized')
        }
      })
    }

    if (callbackInUrl) {
      timeout = window.setTimeout(() => {
          if (!active) return
          clearAuthCallbackFromUrl()
          setError('This recovery link is invalid, expired, or already used. Request a new password recovery email.')
          setStatus((current) => current === 'loading' ? 'invalid' : current)
        }, 15_000)
    }

    return () => {
      active = false
      subscription.unsubscribe()
      if (timeout !== undefined) window.clearTimeout(timeout)
    }
  }, [callbackInUrl, location.state, recoverySessionEstablished])

  const requestAnotherLink = async () => {
    if (!supabase) {
      setError('Password recovery is not configured. Contact the site administrator.')
      return
    }

    try {
      setError('')
      setNotice('')
      setIsSendingReset(true)
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(adminEmail, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })
      if (resetError) throw resetError
      setNotice('If an admin account exists, a new recovery link has been sent to the configured administrator email.')
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Unable to send a password recovery email.')
    } finally {
      setIsSendingReset(false)
    }
  }

  const updatePassword = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase || status !== 'ready') return

    if (newPassword.length < 8) {
      setError('Your password must be at least 8 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    try {
      setError('')
      setNotice('')
      setIsSubmitting(true)
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) throw updateError

      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError

      setNotice('Password updated. Redirecting to admin sign in...')
      navigate('/admin/login', { replace: true, state: { passwordUpdated: true } })
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update the password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canRequestLink = Boolean(supabase && adminEmail)

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 text-[var(--text)]">
      <section className="w-full max-w-md rounded-[2rem] border border-[var(--line)] bg-[var(--card)] p-8 shadow-[var(--shadow-soft)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-white"><ShieldCheck size={22} /></div>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Eyad Works CMS</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[var(--heading)]">
          {status === 'ready' ? 'Set a new password' : 'Password recovery'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {status === 'ready'
            ? 'Choose a new password for the configured administrator account.'
            : 'Use a valid recovery link sent to the configured administrator email.'}
        </p>

        {status === 'loading' && (
          <p role="status" className="mt-6 text-sm text-[var(--muted)]">Verifying your recovery link...</p>
        )}

        {status === 'ready' && (
          <form onSubmit={updatePassword} className="mt-6 space-y-4">
            <label className="block text-sm">
              <span className="mb-2 block">New password</span>
              <span className="relative block">
                <input
                  required
                  minLength={8}
                  autoComplete="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--soft)] px-4 py-3 pr-12 text-sm outline-none focus:border-[var(--accent)]"
                />
                <button type="button" onClick={() => setShowNewPassword((visible) => !visible)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--heading)]" aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}>
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>
            <label className="block text-sm">
              <span className="mb-2 block">Confirm new password</span>
              <span className="relative block">
                <input
                  required
                  minLength={8}
                  autoComplete="new-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter the new password again"
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--soft)] px-4 py-3 pr-12 text-sm outline-none focus:border-[var(--accent)]"
                />
                <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--heading)]" aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}>
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-rose-400">The passwords do not match.</p>
            )}
            <button disabled={isSubmitting} className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Updating password...' : 'Update password'}
            </button>
          </form>
        )}

        {status === 'invalid' && canRequestLink && (
          <button type="button" disabled={isSendingReset} onClick={() => void requestAnotherLink()} className="mt-6 w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
            {isSendingReset ? 'Sending recovery link...' : 'Request a new recovery link'}
          </button>
        )}

        {error && <p role="alert" className="mt-4 text-sm text-rose-400">{error}</p>}
        {notice && <p role="status" className="mt-4 text-sm text-emerald-400">{notice}</p>}
        {status === 'unauthorized' && <p role="alert" className="mt-6 text-sm text-rose-400">This recovery session is not authorized for the administrator account.</p>}
        <a href="/admin/login" className="mt-6 inline-flex text-sm font-medium text-[var(--muted)] hover:text-[var(--heading)]">Back to admin sign in</a>
      </section>
    </div>
  )
}
