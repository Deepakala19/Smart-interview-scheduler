const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/ADMIN/Documents/GitHub/smart-interview-scheduler/backend/.env' });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String
});

const User = mongoose.model('User', userSchema);

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        const users = await User.find({}, 'name email role');
        console.log('Users in DB:');
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
