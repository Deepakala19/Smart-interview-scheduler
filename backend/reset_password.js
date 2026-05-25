const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/interview_scheduler');
    const user = await User.findOne({ email: 'int1@gmail.com' });
    if (user) {
      user.password = 'password123';
      await user.save();
      console.log('Password reset successfully for int1@gmail.com');
    } else {
      console.log('User not found.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetPassword();
