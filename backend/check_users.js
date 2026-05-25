const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    const users = await User.find({}, 'name email role');
    console.log('Users in database:', JSON.stringify(users, null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
};

checkUsers();
