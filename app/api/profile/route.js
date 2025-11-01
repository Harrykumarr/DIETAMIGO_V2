import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import AccountProfile from '@/models/AccountProfile';

// GET user profile
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Try to load profile from separate AccountProfile collection first
    const accountProfile = await AccountProfile.findOne({ user: session.user.id }).lean();

    if (accountProfile) {
      // Remove internal fields
      const { _id, user, __v, ...profileData } = accountProfile;
      return NextResponse.json({ profile: profileData });
    }

    // Fallback to legacy embedded profile on User
    const user = await User.findById(session.user.id).lean();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile: user.profile || {} });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Profile GET error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT/UPDATE user profile
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { profile } = body;

    if (!profile || typeof profile !== 'object') {
      return NextResponse.json(
        { error: 'Invalid profile data' },
        { status: 400 }
      );
    }

    // Validate profile fields
    if (profile.age !== undefined && (typeof profile.age !== 'number' || profile.age < 1 || profile.age > 150)) {
      return NextResponse.json(
        { error: 'Age must be between 1 and 150' },
        { status: 400 }
      );
    }

    if (profile.weight !== undefined && (typeof profile.weight !== 'number' || profile.weight < 1 || profile.weight > 500)) {
      return NextResponse.json(
        { error: 'Weight must be between 1 and 500 kg' },
        { status: 400 }
      );
    }

    if (profile.height !== undefined && (typeof profile.height !== 'number' || profile.height < 0.5 || profile.height > 3)) {
      return NextResponse.json(
        { error: 'Height must be between 0.5 and 3 meters' },
        { status: 400 }
      );
    }

    if (profile.gender !== undefined && !['male', 'female', 'other', 'prefer-not-to-say'].includes(profile.gender)) {
      return NextResponse.json(
        { error: 'Invalid gender value' },
        { status: 400 }
      );
    }

    if (profile.activityLevel !== undefined && !['sedentary', 'moderate', 'active'].includes(profile.activityLevel)) {
      return NextResponse.json(
        { error: 'Invalid activity level' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Upsert into AccountProfile collection
    const cleanedProfile = Object.fromEntries(
      Object.entries(profile).filter(([_, value]) => value !== undefined)
    );

    const updated = await AccountProfile.findOneAndUpdate(
      { user: session.user.id },
      { user: session.user.id, ...cleanedProfile },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    ).lean();

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: updated,
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Profile PUT error:', error);
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

