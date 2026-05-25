const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/interview_scheduler');
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@test.com' });
        if (!existingAdmin) {
            await User.create({
                name: 'Admin User',
                email: 'admin@test.com',
                password: 'password123',
                role: 'admin'
            });
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }

        // Create a test HR user
        const existingHR = await User.findOne({ email: 'hr@test.com' });
        if (!existingHR) {
            await User.create({
                name: 'HR Manager',
                email: 'hr@test.com',
                password: 'password123',
                role: 'hr'
            });
            console.log('HR user created');
        }

        // Create a test candidate user
        const existingCandidate = await User.findOne({ email: 'candidate@test.com' });
        if (!existingCandidate) {
            await User.create({
                name: 'Test Candidate',
                email: 'candidate@test.com',
                password: 'password123',
                role: 'candidate'
            });
            console.log('Candidate user created');
        }

        console.log('Seeding finished');
        process.exit(0);
    } catch (err) {
        console.error('Error during seeding:', err.message);
        process.exit(1);
    }
};

seed();
