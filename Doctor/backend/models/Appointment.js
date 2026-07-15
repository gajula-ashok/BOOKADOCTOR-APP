const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    date: {
      type: String,
      required: [true, 'Please select a date']
    },
    time: {
      type: String,
      required: [true, 'Please select a time slot']
    },
    problemDescription: {
      type: String,
      required: [true, 'Please describe your problem']
    },
    medicalReport: {
      type: String
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('Appointment', appointmentSchema);
