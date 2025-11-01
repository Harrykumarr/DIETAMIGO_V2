import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import JournalEntry from '@/models/JournalEntry';

// GET single journal entry
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const entry = await JournalEntry.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!entry) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ entry: entry.toObject() });

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

// PUT update journal entry
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, date, ...additionalFields } = body;

    await connectToDatabase();

    const entry = await JournalEntry.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!entry) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    // Update fields
    if (title !== undefined) entry.title = title.trim().slice(0, 200);
    if (content !== undefined) entry.content = content ? content.trim().slice(0, 5000) : '';
    if (date !== undefined) entry.date = new Date(date);
    
    // Update additional fields
    Object.keys(additionalFields).forEach(key => {
      if (additionalFields[key] !== undefined) {
        entry[key] = additionalFields[key];
      }
    });

    await entry.save();

    return NextResponse.json({
      message: 'Journal entry updated successfully',
      entry: entry.toObject(),
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Journal PUT error:', error);
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

// DELETE journal entry
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const entry = await JournalEntry.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!entry) {
      return NextResponse.json(
        { error: 'Journal entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Journal entry deleted successfully',
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Journal DELETE error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

