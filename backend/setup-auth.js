const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: 'c:/Users/ADMIN/Documents/GitHub/smart-interview-scheduler/backend/.env' });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model('UserDebug2', userSchema, 'users'); 

async function setup() {
    try {
        console.log('Connecting to', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'hr-new@example.com';
        
        await User.deleteMany({ email });
        const hr = new User({
            name: 'HR Team',
            email: email,
            password: 'password',
            role: 'hr'
        });
        await hr.save();
        console.log(`HR User re-created: ${email} / password`);
        
        process.exit(0);
    } catch (err) {
        console.error('FINAL ERROR:', err.message);
        process.exit(1);
    }
}
setup();
