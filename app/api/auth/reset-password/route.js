import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, token, password } = body

    if (!userId || !token || !password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Invalid input or password too short' }, { status: 400 })
    }

    await connectToDatabase()

    const user = await User.findOne({ _id: userId }).select('+resetPasswordToken +resetPasswordExpires +password')

    if (!user) {
      return NextResponse.json({ error: 'Invalid token or user' }, { status: 400 })
    }

    if (!user.resetPasswordToken || user.resetPasswordToken !== token) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires.getTime() < Date.now()) {
      return NextResponse.json({ error: 'Token has expired' }, { status: 400 })
    }

    // Set new password and clear token fields
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    return NextResponse.json({ message: 'Password reset successful' })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
