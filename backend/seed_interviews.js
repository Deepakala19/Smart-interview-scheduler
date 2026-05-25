const mongoose = require('mongoose');
const User = require('./models/User');
const Interview = require('./models/Interview');
const dotenv = require('dotenv');

dotenv.config();

const seedInterviews = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/interview_scheduler');
        console.log('Connected to MongoDB');

        const admin = await User.findOne({ email: 'admin@test.com' });
        const hr = await User.findOne({ email: 'hr@test.com' });
        const candidate = await User.findOne({ email: 'candidate@test.com' });

        if (!admin || !hr || !candidate) {
            console.error('Core users not found. Run seed.js first.');
            process.exit(1);
        }

        // Check if interviews already exist
        const existing = await Interview.findOne({ candidateId: candidate._id });
        if (!existing) {
            await Interview.create({
                title: 'Technical Interview - Frontend',
                description: 'Deep dive into React and Framer Motion.',
                date: '2026-03-22',
                startTime: '10:00 AM',
                endTime: '11:00 AM',
                candidateId: candidate._id,
                hrId: hr._id,
                adminId: admin._id,
                status: 'scheduled',
                adminStatus: 'accepted'
            });
            console.log('Test interview created');
        } else {
            // Update the existing one to be in the future
            existing.date = '2026-03-22';
            await existing.save();
            console.log('Test interview updated to future date');
        }

        console.log('Interview seeding finished');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

seedInterviews();
