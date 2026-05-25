const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./backend/models/User');

dotenv.config({ path: './backend/.env' });

const checkUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/interview_scheduler';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    const users = await User.find({}, 'name email role');
    if (users.length === 0) {
      console.log('No users found in database.');
    } else {
      console.log('Users in database:', users);
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
};

checkUsers();
