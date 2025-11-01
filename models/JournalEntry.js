import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['meal', 'workout', 'mood', 'goal', 'note'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  content: {
    type: String,
    maxlength: [5000, 'Content cannot be more than 5000 characters'],
  },
  // Meal specific fields
  calories: {
    type: Number,
    min: 0,
    max: 10000,
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'other'],
  },
  tags: [{
    type: String,
    maxlength: 50,
  }],
  // Workout specific fields
  duration: {
    type: Number, // in minutes
    min: 0,
    max: 1440,
  },
  caloriesBurned: {
    type: Number,
    min: 0,
    max: 5000,
  },
  workoutType: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
  },
  // Mood specific fields
  mood: {
    type: String,
    enum: ['excellent', 'good', 'okay', 'poor', 'terrible'],
  },
  energyLevel: {
    type: String,
    enum: ['high', 'moderate', 'low'],
  },
  sleepHours: {
    type: Number,
    min: 0,
    max: 24,
  },
  // Goal progress
  goalCategory: {
    type: String,
  },
  progressValue: {
    type: Number,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
journalEntrySchema.index({ userId: 1, date: -1 });
journalEntrySchema.index({ userId: 1, type: 1, date: -1 });

// Create or get existing model
const JournalEntry = mongoose.models.JournalEntry || mongoose.model('JournalEntry', journalEntrySchema);

if (process.env.NODE_ENV === 'development') {
  console.log('📝 JournalEntry model initialized:', JournalEntry.modelName);
}

export default JournalEntry;

