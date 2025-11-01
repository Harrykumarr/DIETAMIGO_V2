"use client"

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const id = searchParams.get('id')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('')

    if (!token || !id) {
      setError('Invalid reset link')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, token, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to reset password')
        return
      }

      setStatus('Password reset successful. Redirecting to login...')
      setTimeout(() => router.push('/login'), 1500)
    } catch (err) {
      console.error('Reset password error:', err)
      setError('An unexpected error occurred')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <p className="text-sm text-muted-foreground mb-4">Choose a new password for your account.</p>

      {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-3">{error}</div>}
      {status && <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md mb-3">{status}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>

        <div>
          <Button type="submit" className="w-full">Reset password</Button>
        </div>
      </form>
    </div>
  )
}
