const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    specialization: {
      type: String,
      required: [true, 'Please add a specialization']
    },
    experience: {
      type: Number,
      required: [true, 'Please add experience in years']
    },
    qualification: {
      type: String,
      required: [true, 'Please add qualifications']
    },
    hospital: {
      type: String,
      required: [true, 'Please add hospital/clinic name']
    },
    consultationFee: {
      type: Number,
      required: [true, 'Please add consultation fee']
    },
    availableDays: {
      type: [String],
      required: [true, 'Please specify available days of the week']
    },
    availableTimings: {
      start: {
        type: String,
        required: [true, 'Please specify start time (e.g. 09:00)']
      },
      end: {
        type: String,
        required: [true, 'Please specify end time (e.g. 17:00)']
      }
    },
    rating: {
      type: Number,
      default: 4.5
    },
    ratingsCount: {
      type: Number,
      default: 1
    },
    biography: {
      type: String,
      required: [true, 'Please add a biography']
    },
    languages: {
      type: [String],
      required: [true, 'Please specify languages spoken']
    },
    certificates: {
      type: [String],
      default: []
    },
    isSuspended: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('Doctor', doctorSchema);
