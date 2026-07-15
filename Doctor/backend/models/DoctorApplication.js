const mongoose = require('mongoose');
const doctorApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required']
    },
    experience: {
      type: Number,
      required: [true, 'Experience in years is required']
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required']
    },
    hospital: {
      type: String,
      required: [true, 'Hospital/Clinic name is required']
    },
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required']
    },
    availableDays: {
      type: [String],
      required: [true, 'Available days are required']
    },
    availableTimings: {
      start: {
        type: String,
        required: [true, 'Start time is required']
      },
      end: {
        type: String,
        required: [true, 'End time is required']
      }
    },
    biography: {
      type: String,
      required: [true, 'Biography is required']
    },
    languages: {
      type: [String],
      required: [true, 'Languages are required']
    },
    certificates: {
      type: [String],
      required: [true, 'At least one certificate is required']
    },
    profilePhoto: {
      type: String,
      required: [true, 'Profile photo is required']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('DoctorApplication', doctorApplicationSchema);
