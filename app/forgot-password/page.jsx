"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to request reset')
        return
      }
      setStatus('If that email exists, a reset link has been sent.')
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Forgot password submit error:', err)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <p className="text-sm text-muted-foreground mb-4">Enter your email and we'll send password reset instructions if the account exists.</p>

      {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mb-3">{error}</div>}
      {status && <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md mb-3">{status}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div>
          <Button type="submit" className="w-full">Send reset link</Button>
        </div>
      </form>
    </div>
  )
}
