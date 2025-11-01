import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import JournalEntry from '@/models/JournalEntry';

// GET all journal entries for the user
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
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit')) || 50;

    // Build query
    const query = { userId: session.user.id };
    
    if (type) {
      query.type = type;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const entries = await JournalEntry.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      entries,
      count: entries.length,
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Journal GET error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new journal entry
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
    const { type, title, content, date, ...additionalFields } = body;

    // Validate required fields
    if (!type || !title) {
      return NextResponse.json(
        { error: 'Type and title are required' },
        { status: 400 }
      );
    }

    if (!['meal', 'workout', 'mood', 'goal', 'note'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid entry type' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const entry = new JournalEntry({
      userId: session.user.id,
      type,
      title: title.trim().slice(0, 200),
      content: content ? content.trim().slice(0, 5000) : '',
      date: date ? new Date(date) : new Date(),
      ...additionalFields,
    });

    await entry.save();

    return NextResponse.json({
      message: 'Journal entry created successfully',
      entry: entry.toObject(),
    }, { status: 201 });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Journal POST error:', error);
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

