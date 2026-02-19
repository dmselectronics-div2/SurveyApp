const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../../models/User');

async function listUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({});
        console.log('--- USERS ---');
        users.forEach(u => console.log(`- ${u.email} (Role: ${u.role})`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
listUsers();
