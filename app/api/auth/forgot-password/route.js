import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    await connectToDatabase()

    const user = await User.findOne({ email: email.trim().toLowerCase() })

    // Always respond with success to avoid user enumeration
    if (!user) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Forgot password requested for non-existent email:', email)
      }
      return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' })
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = Date.now() + 1000 * 60 * 60 // 1 hour

    user.resetPasswordToken = token
    user.resetPasswordExpires = new Date(expires)

    await user.save()

    const resetUrlBase = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || ''
    const resetUrl = `${resetUrlBase}/reset-password?token=${token}&id=${user._id}`

    // Try to send email if SMTP configured, otherwise log link in dev
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        // require nodemailer lazily so the route doesn't fail if package is not installed
        const nodemailer = await import('nodemailer')
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })

        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'no-reply@example.com',
          to: user.email,
          subject: 'Reset your password',
          text: `You requested a password reset. Use the link: ${resetUrl}\nIf you did not request this, ignore this email.`,
          html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. The link expires in 1 hour.</p>`,
        })
      } catch (sendErr) {
        if (process.env.NODE_ENV === 'development') console.error('Failed to send reset email:', sendErr)
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('Password reset link (development):', resetUrl)
      }
    }

    return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
