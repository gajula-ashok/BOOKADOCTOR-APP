require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./Config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const User = require('./models/User');
// Connect to Database
connectDB();
const app = express();
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
// Root path API check
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MediCare MERN API!' });
});
// Error handlers
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
// Seed Admin account
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'MediCare Administrator',
        email: 'admin@medicare.com',
        password: 'AdminPass123!', // will be hashed automatically by pre-save hook
        phone: '1234567890',
        age: 35,
        gender: 'Other',
        address: 'MediCare HQ',
        profilePhoto: '/uploads/default-avatar.png',
        role: 'admin'
      });
      console.log('Seeded Administrator account successfully: admin@medicare.com / AdminPass123!');
    }
  } catch (error) {
    console.error('Error seeding Admin:', error.message);
  }
};
app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  await seedAdmin();
});