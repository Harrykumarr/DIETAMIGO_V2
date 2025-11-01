import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include password in queries by default
  },
  // User profile information
  profile: {
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
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Index for faster email lookups
// Note: 'unique: true' on the email field already creates an index.
// Avoid duplicate index declarations to prevent Mongoose warnings.

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get user without password
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static method to find user by email with password
userSchema.statics.findByEmailWithPassword = function (email) {
  return this.findOne({ email }).select('+password');
};

// Create or get existing model (prevents re-compilation errors)
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Debug logging only in development
if (process.env.NODE_ENV === 'development') {
  console.log('📝 User model initialized:', User.modelName);
}

export default User;