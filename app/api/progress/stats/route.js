import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import ExerciseSession from '@/models/ExerciseSession';
import JournalEntry from '@/models/JournalEntry';

// GET progress statistics
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
    const days = parseInt(searchParams.get('days')) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    // Get exercise sessions
    const exerciseSessions = await ExerciseSession.find({
      userId: session.user.id,
      date: { $gte: startDate, $lte: endDate },
    }).lean();

    // Get workout journal entries
    const workoutEntries = await JournalEntry.find({
      userId: session.user.id,
      type: 'workout',
      date: { $gte: startDate, $lte: endDate },
    }).lean();

    // Calculate statistics
    const totalReps = exerciseSessions.reduce((sum, session) => sum + (session.reps || 0), 0);
    const totalCaloriesBurned = [
      ...exerciseSessions.map(s => s.caloriesBurned || 0),
      ...workoutEntries.map(e => e.caloriesBurned || 0),
    ].reduce((sum, cal) => sum + cal, 0);

    const totalSessions = exerciseSessions.length + workoutEntries.length;
    const totalDuration = [
      ...exerciseSessions.map(s => s.duration || 0),
      ...workoutEntries.map(e => (e.duration || 0) * 60), // convert minutes to seconds
    ].reduce((sum, dur) => sum + dur, 0);

    // Calculate weekly stats
    const weeklyStart = new Date();
    weeklyStart.setDate(weeklyStart.getDate() - 7);
    weeklyStart.setHours(0, 0, 0, 0);

    const weeklySessions = exerciseSessions.filter(s => new Date(s.date) >= weeklyStart).length +
      workoutEntries.filter(e => new Date(e.date) >= weeklyStart).length;

    // Calculate streak (consecutive days with exercise)
    const datesWithExercise = new Set();
    [...exerciseSessions, ...workoutEntries].forEach(item => {
      const dateStr = new Date(item.date).toDateString();
      datesWithExercise.add(dateStr);
    });

    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);
      const dateStr = checkDate.toDateString();
      if (datesWithExercise.has(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    // Get exercise type breakdown
    const exerciseBreakdown = {};
    exerciseSessions.forEach(session => {
      const type = session.exerciseType || 'other';
      if (!exerciseBreakdown[type]) {
        exerciseBreakdown[type] = { count: 0, totalReps: 0 };
      }
      exerciseBreakdown[type].count++;
      exerciseBreakdown[type].totalReps += session.reps || 0;
    });

    return NextResponse.json({
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        days,
      },
      totals: {
        totalReps,
        totalCaloriesBurned: Math.round(totalCaloriesBurned),
        totalSessions,
        totalDuration: Math.round(totalDuration / 60), // minutes
        averageRepsPerSession: totalSessions > 0 ? Math.round(totalReps / totalSessions) : 0,
      },
      weekly: {
        sessions: weeklySessions,
      },
      streak: {
        days: streak,
      },
      breakdown: exerciseBreakdown,
      recentSessions: exerciseSessions.slice(0, 10),
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Progress stats GET error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

