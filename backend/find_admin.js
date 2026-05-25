const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const findAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/interview_scheduler');
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log('Found Admin:', admin.email);
    } else {
      console.log('No Admin found.');
      const allUsers = await User.find({}, 'email role');
      console.log('All Users:', allUsers);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

findAdmin();
