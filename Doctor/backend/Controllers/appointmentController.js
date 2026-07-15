const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Notification = require('../models/Notification');
// @desc    Book a new appointment
// @route   POST /api/appointments/book
// @access  Private (Patient role)
const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, time, problemDescription } = req.body;
    const doctor = await Doctor.findById(doctorId).populate('userId', 'name');
    if (!doctor) {
      res.status(404);
      throw new Error('Doctor not found');
    }
    let medicalReport = '';
    if (req.file) {
      medicalReport = `/uploads/${req.file.filename}`;
    }
    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      time,
      problemDescription,
      medicalReport,
      status: 'Pending'
    });
    // Notify doctor
    await Notification.create({
      recipientId: doctor.userId._id, // doctor's user model ID
      senderId: req.user._id,
      message: `New appointment request from ${req.user.name} on ${date} at ${time}`,
      type: 'new_appointment'
    });
    res.status(201).json({
      message: 'Appointment booked successfully. Awaiting doctor approval.',
      appointment
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get appointments (Role-based)
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    } else if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: req.user._id });
      if (!doctorProfile) {
        return res.json([]); // Return empty if doctor profile not found yet
      }
      query.doctorId = doctorProfile._id;
    }
    // Admins see all, which means empty query filter.
    // Fetch and populate details
    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email phone profilePhoto age gender address')
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: 'name email phone profilePhoto'
        }
      })
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};
// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name')
      .populate({
        path: 'doctorId',
        populate: {
          path: 'userId',
          select: '_id name'
        }
      });
    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }
    // Role-based auth checks:
    // Only doctor can Approve, Reject, or Complete.
    // Patients and doctors can Cancel.
    if (status === 'Approved' || status === 'Rejected' || status === 'Completed') {
      if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Only the doctor or administrator can update this status');
      }
    }
    appointment.status = status;
    await appointment.save();
    // Create notifications based on status change
    let notificationMsg = '';
    let recipientId = appointment.patientId._id; // notify patient by default
    let notificationType = 'appointment_status';
    if (status === 'Approved') {
      notificationMsg = `Your appointment with Dr. ${appointment.doctorId.userId.name} on ${appointment.date} has been Approved.`;
      notificationType = 'appointment_approved';
    } else if (status === 'Rejected') {
      notificationMsg = `Your appointment with Dr. ${appointment.doctorId.userId.name} on ${appointment.date} has been Rejected.`;
      notificationType = 'appointment_rejected';
    } else if (status === 'Completed') {
      notificationMsg = `Your appointment with Dr. ${appointment.doctorId.userId.name} on ${appointment.date} has been Completed.`;
      notificationType = 'appointment_completed';
    } else if (status === 'Cancelled') {
      notificationMsg = `Appointment on ${appointment.date} was cancelled by ${req.user.name}.`;
      // Send notify based on who cancelled:
      if (req.user.role === 'patient') {
        recipientId = appointment.doctorId.userId._id; // notify doctor
      } else {
        recipientId = appointment.patientId._id; // notify patient
      }
      notificationType = 'appointment_cancelled';
    }
    await Notification.create({
      recipientId,
      senderId: req.user._id,
      message: notificationMsg,
      type: notificationType
    });
    res.json({
      message: `Appointment status updated to ${status}`,
      appointment
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Delete/Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }
    // Check ownership
    if (
      appointment.patientId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      res.status(401);
      throw new Error('User not authorized');
    }
    await appointment.deleteOne();
    res.json({ message: 'Appointment removed' });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment
};
