const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Admin = require('../models/Admin');

async function listAdmins() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const admins = await Admin.find({});
        console.log('--- ADMINS ---');
        admins.forEach(a => console.log(`- ${a.email} (ID: ${a._id})`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
listAdmins();
