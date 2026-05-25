const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: 'c:/Users/ADMIN/Documents/GitHub/smart-interview-scheduler/backend/.env' });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: { type: String, select: false },
    role: String,
    hasCompletedProfile: Boolean,
    applicationRound: String,
    hrRound: String,
    technicalRound: String,
    finalRound: String
});

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

const User = mongoose.model('User', userSchema);

async function reset() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'hr-new@example.com';
        
        // Delete all users with this email first to be clean
        await User.deleteMany({ email });
        
        // Create a clean HR user
        const hr = new User({
            name: 'HR Admin',
            email: email,
            password: 'password',
            role: 'hr'
        });
        await hr.save();
        console.log(`Clean HR user created: ${email} with password 'password' and role 'hr'`);
        
        // Also ensure Candidate exists
        const cEmail = 'candidate@example.com';
        await User.deleteMany({ email: cEmail });
        const can = new User({
            name: 'John Candidate',
            email: cEmail,
            password: 'password',
            role: 'candidate',
            hasCompletedProfile: true,
            applicationRound: 'completed',
            hrRound: 'completed',
            technicalRound: 'pending'
        });
        await can.save();
        console.log(`Clean Candidate user created: ${cEmail} with password 'password' and role 'candidate'`);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

reset();
