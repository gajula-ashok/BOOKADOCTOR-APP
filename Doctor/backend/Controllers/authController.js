const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
// @desc    Register a new user (patient)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, age, gender, address } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
    let profilePhoto = '/uploads/default-avatar.png';
    if (req.file) {
      profilePhoto = `/uploads/${req.file.filename}`;
    }
    const user = await User.create({
      name,
      email,
      password,
      phone,
      age: Number(age),
      gender,
      address,
      profilePhoto,
      role: 'patient' // default
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        address: user.address,
        profilePhoto: user.profilePhoto,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};
// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      // Check if suspended
      if (user.role === 'doctor') {
        const doctorProfile = await Doctor.findOne({ userId: user._id });
        if (doctorProfile && doctorProfile.isSuspended) {
          res.status(403);
          throw new Error('Your doctor account is suspended. Contact administrator.');
        }
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        address: user.address,
        profilePhoto: user.profilePhoto,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};
// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      let doctorProfile = null;
      if (user.role === 'doctor') {
        doctorProfile = await Doctor.findOne({ userId: user._id });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        address: user.address,
        profilePhoto: user.profilePhoto,
        role: user.role,
        doctorProfile
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.age = req.body.age ? Number(req.body.age) : user.age;
      user.gender = req.body.gender || user.gender;
      user.address = req.body.address || user.address;
      if (req.body.password) {
        user.password = req.body.password;
      }
      if (req.file) {
        user.profilePhoto = `/uploads/${req.file.filename}`;
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          name: user.name,
          phone: user.phone,
          age: user.age,
          gender: user.gender,
          address: user.address,
          password: user.password,
          profilePhoto: user.profilePhoto
        },
        { new: true, runValidators: true }
      );
      // If doctor, update doctor profile details directly
      let doctorProfile = null;
      if (updatedUser.role === 'doctor') {
        const { specialization, experience, qualification, hospital, consultationFee, availableDays, availableTimings, biography, languages } = req.body;
        if (specialization) {
          const parsedTimings = typeof availableTimings === 'string' ? JSON.parse(availableTimings) : availableTimings;
          const parsedDays = typeof availableDays === 'string' ? JSON.parse(availableDays) : availableDays;
          const parsedLanguages = typeof languages === 'string' ? JSON.parse(languages) : languages;
          doctorProfile = await Doctor.findOneAndUpdate(
            { userId: updatedUser._id },
            {
              specialization,
              experience: Number(experience),
              qualification,
              hospital,
              consultationFee: Number(consultationFee),
              availableDays: parsedDays,
              availableTimings: parsedTimings,
              biography,
              languages: parsedLanguages
            },
            { new: true, runValidators: true, upsert: true }
          );
        } else {
          doctorProfile = await Doctor.findOne({ userId: updatedUser._id });
        }
      }
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        age: updatedUser.age,
        gender: updatedUser.gender,
        address: updatedUser.address,
        profilePhoto: updatedUser.profilePhoto,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
        doctorProfile
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};