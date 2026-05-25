const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['candidate', 'admin', 'hr'],
      default: 'candidate',
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interviewing', 'Accepted', 'Rejected'],
      default: 'Applied',
    },
    hasCompletedProfile: {
      type: Boolean,
      default: false,
    },
    applicationRound: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    hrRound: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    technicalRound: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    finalRound: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    phone: String,
    location: String,
    jobRole: String,
    yearsExperience: String,
    education: String,
    portfolioUrl: String,
    githubUrl: String,
    linkedinUrl: String,
    coverLetter: String,
    resumeUrl: String,
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
