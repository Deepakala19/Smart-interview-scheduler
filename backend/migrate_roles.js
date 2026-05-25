const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Interview = require('./models/Interview');

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/interview_scheduler');
    console.log('Connected to MongoDB for migration...');

    // 1. Update User roles
    const userResult = await User.updateMany(
      { role: 'interviewer' },
      { $set: { role: 'admin' } }
    );
    console.log(`Updated ${userResult.modifiedCount} users from 'interviewer' to 'admin'`);

    // 2. Note: If we rename fields in the Interview model (interviewerId -> adminId),
    // we should do that during the migration if using a strict schema.
    // However, Mongoose schemas are usually updated first.
    // Let's rename the fields in all existing interview documents.
    const interviewResult = await Interview.updateMany(
      {},
      { 
        $rename: { 
          "interviewerId": "adminId", 
          "interviewerStatus": "adminStatus" 
        } 
      }
    );
    console.log(`Updated ${interviewResult.modifiedCount} interview documents (renamed fields)`);

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
