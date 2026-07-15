const Doctor = require('../models/Doctor');
const DoctorApplication = require('../models/DoctorApplication');
const User = require('../models/User');
const Notification = require('../models/Notification');
// @desc    Get all approved, non-suspended doctors (with search, filter, pagination)
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const {
      search, // Doctor Name, Specialization, Hospital
      specialization,
      hospital,
      experience, // minimum experience
      maxFee, // maximum fee
      availability, // Day of week
      page = 1,
      limit = 10
    } = req.query;
    const query = { isSuspended: false };
    // Filter by Specialization
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }
    // Filter by Hospital
    if (hospital) {
      query.hospital = { $regex: hospital, $options: 'i' };
    }
    // Filter by Experience (Minimum years)
    if (experience) {
      query.experience = { $gte: Number(experience) };
    }
    // Filter by Consultation Fee (Maximum)
    if (maxFee) {
      query.consultationFee = { $lte: Number(maxFee) };
    }
    // Filter by Available Day
    if (availability) {
      query.availableDays = availability; // matches value in array
    }
    // Search by Name, Specialization or Hospital
    if (search) {
      // Find users matching search name
      const matchingUsers = await User.find({
        name: { $regex: search, $options: 'i' },
        role: 'doctor'
      }).select('_id');
      const userIds = matchingUsers.map((u) => u._id);
      query.$or = [
        { userId: { $in: userIds } },
        { specialization: { $regex: search, $options: 'i' } },
        { hospital: { $regex: search, $options: 'i' } }
      ];
    }
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const doctors = await Doctor.find(query)
      .populate('userId', 'name email phone profilePhoto')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    const total = await Doctor.countDocuments(query);
    res.json({
      doctors,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      'userId',
      'name email phone profilePhoto address age gender'
    );
    if (!doctor) {
      res.status(404);
      throw new Error('Doctor not found');
    }
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};
// @desc    Apply as a Doctor
// @route   POST /api/doctors/apply
// @access  Private (Patient role)
const applyAsDoctor = async (req, res, next) => {
  try {
    // Check if an application already exists and is pending
    const existingApp = await DoctorApplication.findOne({
      userId: req.user._id,
      status: 'pending'
    });
    if (existingApp) {
      res.status(400);
      throw new Error('You already have a pending doctor application');
    }
    const {
      name,
      email,
      phone,
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
    if (!req.files || !req.files['profilePhoto'] || !req.files['certificates']) {
      res.status(400);
      throw new Error('Please upload your profile photo and at least one certificate');
    }
    const profilePhoto = `/uploads/${req.files['profilePhoto'][0].filename}`;
    const certificates = req.files['certificates'].map(
      (file) => `/uploads/${file.filename}`
    );
    // Create doctor application
    const application = await DoctorApplication.create({
      userId: req.user._id,
      name: name || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      specialization,
      experience: Number(experience),
      qualification,
      hospital,
      consultationFee: Number(consultationFee),
      availableDays: Array.isArray(availableDays) ? availableDays : JSON.parse(availableDays),
      availableTimings: typeof availableTimings === 'string' ? JSON.parse(availableTimings) : availableTimings,
      biography,
      languages: Array.isArray(languages) ? languages : JSON.parse(languages),
      certificates,
      profilePhoto,
      status: 'pending'
    });
    // Notify admins
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        recipientId: admin._id,
        senderId: req.user._id,
        message: `New doctor application from ${req.user.name}`,
        type: 'new_doctor_application'
      });
    }
    res.status(201).json({
      message: 'Application submitted successfully. It is now pending admin approval.',
      application
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getDoctors,
  getDoctorById,
  applyAsDoctor
};