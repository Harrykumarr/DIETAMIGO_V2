import mongoose from 'mongoose'

const accountProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Associated user is required'],
    unique: true, // one profile per user
  },
  age: {
    type: Number,
    min: [1, 'Age must be at least 1'],
    max: [150, 'Age must be less than 150'],
  },
  weight: {
    type: Number,
    min: [1, 'Weight must be at least 1 kg'],
    max: [500, 'Weight must be less than 500 kg'],
  },
  height: {
    type: Number,
    min: [0.5, 'Height must be at least 0.5 m'],
    max: [3, 'Height must be less than 3 m'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'moderate', 'active'],
  },
  dietaryRestrictions: {
    type: [String],
    default: [],
  },
  goals: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
})

// Ensure index for quick lookups by user
accountProfileSchema.index({ user: 1 })

const AccountProfile = mongoose.models.AccountProfile || mongoose.model('AccountProfile', accountProfileSchema)

if (process.env.NODE_ENV === 'development') {
  console.log('📝 AccountProfile model initialized:', AccountProfile.modelName)
}

export default AccountProfile
