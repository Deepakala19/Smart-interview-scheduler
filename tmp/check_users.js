const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./backend/models/User');

dotenv.config({ path: './backend/.env' });

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    const users = await User.find({}, 'name email role');
    console.log('Users in database:', users);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
};

checkUsers();
