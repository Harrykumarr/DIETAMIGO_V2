import mongoose from 'mongoose';

const exerciseSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  exerciseType: {
    type: String,
    required: true,
    enum: ['squats', 'front_squats', 'pushups', 'bicep_curls', 'jumping_jacks', 'other'],
  },
  exerciseName: {
    type: String,
    required: true,
    maxlength: [100, 'Exercise name cannot be more than 100 characters'],
  },
  reps: {
    type: Number,
    required: true,
    min: [0, 'Reps cannot be negative'],
    max: [10000, 'Reps cannot exceed 10000'],
  },
  duration: {
    type: Number, // in seconds
    min: 0,
    max: 86400, // max 24 hours
  },
  caloriesBurned: {
    type: Number,
    min: 0,
    max: 5000,
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  feedback: [{
    type: String,
  }],
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
exerciseSessionSchema.index({ userId: 1, date: -1 });
exerciseSessionSchema.index({ userId: 1, exerciseType: 1, date: -1 });

// Virtual for calculating duration if not provided
exerciseSessionSchema.virtual('calculatedDuration').get(function() {
  if (this.duration) return this.duration;
  if (this.startTime && this.endTime) {
    return Math.round((this.endTime - this.startTime) / 1000); // seconds
  }
  return null;
});

// Create or get existing model
const ExerciseSession = mongoose.models.ExerciseSession || mongoose.model('ExerciseSession', exerciseSessionSchema);

if (process.env.NODE_ENV === 'development') {
  console.log('📝 ExerciseSession model initialized:', ExerciseSession.modelName);
}

export default ExerciseSession;

