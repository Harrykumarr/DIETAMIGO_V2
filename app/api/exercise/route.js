import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import ExerciseSession from '@/models/ExerciseSession';

// GET all exercise sessions for the user
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

    const { searchParams } = new URL(request.url);
    const exerciseType = searchParams.get('exerciseType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit')) || 100;

    // Build query
    const query = { userId: session.user.id };
    
    if (exerciseType) {
      query.exerciseType = exerciseType;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sessions = await ExerciseSession.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      sessions,
      count: sessions.length,
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Exercise GET error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new exercise session
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { exerciseType, exerciseName, reps, duration, caloriesBurned, startTime, endTime, feedback } = body;

    // Validate required fields
    if (!exerciseType || !exerciseName || reps === undefined) {
      return NextResponse.json(
        { error: 'Exercise type, name, and reps are required' },
        { status: 400 }
      );
    }

    if (!['squats', 'front_squats', 'pushups', 'bicep_curls', 'jumping_jacks', 'other'].includes(exerciseType)) {
      return NextResponse.json(
        { error: 'Invalid exercise type' },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (reps < 0 || reps > 10000) {
      return NextResponse.json(
        { error: 'Reps must be between 0 and 10000' },
        { status: 400 }
      );
    }

    if (duration !== undefined && (duration < 0 || duration > 86400)) {
      return NextResponse.json(
        { error: 'Duration must be between 0 and 86400 seconds' },
        { status: 400 }
      );
    }

    if (caloriesBurned !== undefined && (caloriesBurned < 0 || caloriesBurned > 5000)) {
      return NextResponse.json(
        { error: 'Calories burned must be between 0 and 5000' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const sessionData = new ExerciseSession({
      userId: session.user.id,
      exerciseType,
      exerciseName: exerciseName.trim().slice(0, 100),
      reps: parseInt(reps),
      duration: duration ? parseInt(duration) : undefined,
      caloriesBurned: caloriesBurned ? parseFloat(caloriesBurned) : undefined,
      startTime: startTime ? new Date(startTime) : new Date(),
      endTime: endTime ? new Date(endTime) : undefined,
      feedback: Array.isArray(feedback) ? feedback : [],
      date: new Date(),
    });

    await sessionData.save();

    return NextResponse.json({
      message: 'Exercise session saved successfully',
      session: sessionData.toObject(),
    }, { status: 201 });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Exercise POST error:', error);
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

