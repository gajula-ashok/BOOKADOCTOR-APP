const User = require('../models/User');
const Doctor = require('../models/Doctor');
const DoctorApplication = require('../models/DoctorApplication');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');
// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments({});
    const totalAppointments = await Appointment.countDocuments({});
    const pendingRequests = await DoctorApplication.countDocuments({ status: 'pending' });
    // Calculate revenue (Sum of fees for completed appointments)
    const completedAppointments = await Appointment.find({ status: 'Completed' }).populate('doctorId', 'consultationFee');
    const totalRevenue = completedAppointments.reduce((sum, app) => {
      return sum + (app.doctorId ? app.doctorId.consultationFee : 0);
    }, 0);
    // Monthly Appointments aggregation (Last 6 months)
    const appointments = await Appointment.find({});
    const monthlyStatsMap = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialise last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = months[d.getMonth()] + ' ' + d.getFullYear().toString().substr(-2);
      monthlyStatsMap[monthName] = 0;
    }
    appointments.forEach(app => {
      // app.date is in YYYY-MM-DD
      const dateParts = app.date.split('-');
      if (dateParts.length === 3) {
        const year = dateParts[0].substr(-2);
        const monthIndex = parseInt(dateParts[1], 10) - 1;
        const monthName = months[monthIndex] + ' ' + year;
        if (monthlyStatsMap[monthName] !== undefined) {
          monthlyStatsMap[monthName] += 1;
        }
      }
    });
    const monthlyAppointments = Object.keys(monthlyStatsMap).map(key => ({
      month: key,
      count: monthlyStatsMap[key]
    }));
    // Recent Registrations (Last 5 users)
    const recentRegistrations = await User.find({ role: 'patient' })
      .select('name email createdAt profilePhoto')
      .sort({ createdAt: -1 })
      .limit(5);
    // Recent Activities (Mix of recent bookings, approvals, applications)
    const recentBookings = await Appointment.find({})
      .populate('patientId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
      
    const recentActivities = recentBookings.map(app => ({
      id: app._id,
      activity: `Patient ${app.patientId ? app.patientId.name : 'Unknown'} booked an appointment for ${app.date}`,
      time: app.createdAt
    }));
    res.json({
      stats: {
        users: totalUsers,
        doctors: totalDoctors,
        appointments: totalAppointments,
        pendingRequests,
        revenue: totalRevenue
      },
      monthlyAppointments,
      recentRegistrations,
      recentActivities
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get all users (patients)
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};
// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    // If user is a doctor, delete doctor profile as well
    if (user.role === 'doctor') {
      await Doctor.deleteOne({ userId: user._id });
    }
    // Delete user appointments
    await Appointment.deleteMany({
      $or: [{ patientId: user._id }, { doctorId: user._id }]
    });
    await user.deleteOne();
    res.json({ message: 'User and all related data deleted successfully' });
  } catch (error) {
    next(error);
  }
};
// @desc    Get all doctor applications
// @route   GET /api/admin/applications
// @access  Private (Admin only)
const getDoctorApplications = async (req, res, next) => {
  try {
    const applications = await DoctorApplication.find({}).sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    next(error);
  }
};
// @desc    Approve doctor application
// @route   PUT /api/admin/approve-doctor/:id
// @access  Private (Admin only)
const approveDoctor = async (req, res, next) => {
  try {
    const application = await DoctorApplication.findById(req.params.id);
    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }
    if (application.status !== 'pending') {
      res.status(400);
      throw new Error(`Application already ${application.status}`);
    }
    application.status = 'approved';
    await application.save();
    // Update user role to doctor and profile photo if updated
    const user = await User.findById(application.userId);
    if (!user) {
      res.status(404);
      throw new Error('User who applied no longer exists');
    }
    user.role = 'doctor';
    if (application.profilePhoto) {
      user.profilePhoto = application.profilePhoto;
    }
    await user.save();
    // Create doctor profile
    await Doctor.create({
      userId: user._id,
      specialization: application.specialization,
      experience: application.experience,
      qualification: application.qualification,
      hospital: application.hospital,
      consultationFee: application.consultationFee,
      availableDays: application.availableDays,
      availableTimings: application.availableTimings,
      biography: application.biography,
      languages: application.languages,
      certificates: application.certificates,
      isSuspended: false
    });
    // Notify user
    await Notification.create({
      recipientId: user._id,
      message: 'Congratulations! Your application to become a doctor has been approved.',
      type: 'doctor_approved'
    });
    res.json({ message: 'Doctor application approved successfully', application });
  } catch (error) {
    next(error);
  }
};
// @desc    Reject doctor application
// @route   PUT /api/admin/reject-doctor/:id
// @access  Private (Admin only)
const rejectDoctor = async (req, res, next) => {
  try {
    const application = await DoctorApplication.findById(req.params.id);
    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }
    if (application.status !== 'pending') {
      res.status(400);
      throw new Error(`Application already ${application.status}`);
    }
    application.status = 'rejected';
    await application.save();
    // Notify user
    await Notification.create({
      recipientId: application.userId,
      message: 'We regret to inform you that your application to become a doctor has been rejected.',
      type: 'doctor_rejected'
    });
    res.json({ message: 'Doctor application rejected successfully', application });
  } catch (error) {
    next(error);
  }
};
// @desc    Get all doctors (approved profiles)
// @route   GET /api/admin/doctors
// @access  Private (Admin only)
const getAdminDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({}).populate('userId', 'name email phone profilePhoto isSuspended').sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};
// @desc    Suspend doctor profile
// @route   PUT /api/admin/suspend-doctor/:id
// @access  Private (Admin only)
const suspendDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      res.status(404);
      throw new Error('Doctor profile not found');
    }
    doctor.isSuspended = !doctor.isSuspended;
    await doctor.save();
    res.json({
      message: `Doctor has been ${doctor.isSuspended ? 'suspended' : 'unsuspended'} successfully`,
      doctor
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Delete doctor profile and user account
// @route   DELETE /api/admin/doctors/:id
// @access  Private (Admin only)
const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      res.status(404);
      throw new Error('Doctor profile not found');
    }
    const userId = doctor.userId;
    // Delete doctor record
    await doctor.deleteOne();
    // Delete doctor's user record
    await User.findByIdAndDelete(userId);
    // Delete doctor's appointments
    await Appointment.deleteMany({ doctorId: req.params.id });
    res.json({ message: 'Doctor and all related account details deleted successfully' });
  } catch (error) {
    next(error);
  }
};
// @desc    Directly add doctor by admin
// @route   POST /api/admin/add-doctor
// @access  Private (Admin only)
const addDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      age,
      gender,
      address,
      specialization,
      experience,
      qualification,
      hospital,
      consultationFee,
      availableDays,
      availableTimings,
      biography,
      languages
    } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User email already exists');
    }
    let profilePhoto = '/uploads/default-avatar.png';
    if (req.file) {
      profilePhoto = `/uploads/${req.file.filename}`;
    }
    // Create user with 'doctor' role
    const user = await User.create({
      name,
      email,
      password,
      phone,
      age: Number(age),
      gender,
      address,
      profilePhoto,
      role: 'doctor'
    });
    // Create doctor profile
    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      experience: Number(experience),
      qualification,
      hospital,
      consultationFee: Number(consultationFee),
      availableDays: Array.isArray(availableDays) ? availableDays : JSON.parse(availableDays),
      availableTimings: typeof availableTimings === 'string' ? JSON.parse(availableTimings) : availableTimings,
      biography,
      languages: Array.isArray(languages) ? languages : JSON.parse(languages),
      certificates: [],
      isSuspended: false
    });
    res.status(201).json({
      message: 'Doctor created successfully by Administrator',
      doctor,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getStats,
  getUsers,
  deleteUser,
  getDoctorApplications,
  approveDoctor,
  rejectDoctor,
  getAdminDoctors,
  suspendDoctor,
  deleteDoctor,
  addDoctor
};
