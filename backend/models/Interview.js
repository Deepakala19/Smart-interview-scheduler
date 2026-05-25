const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for the interview'],
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: [true, 'Please add an interview date'],
    },
    startTime: {
      type: String,
      required: [true, 'Please add a start time'],
    },
    endTime: {
      type: String,
      required: [true, 'Please add an end time'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    hrId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adminStatus: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    meetingLink: {
      type: String,
      default: 'https://meet.google.com/abc-defg-hij',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Interview', interviewSchema);
