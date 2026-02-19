const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Admin = require('../models/Admin');

async function setAndCheck() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const email = 'shamikadulana345@gmail.com';
        const password = 'admin123';

        console.log(`Setting password for ${email} to ${password}...`);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await Admin.findOneAndUpdate(
            { email: email.toLowerCase() },
            { password: hash }
        );

        console.log(`Password updated. Verifying...`);
        const updatedAdmin = await Admin.findOne({ email: email.toLowerCase() });
        const match = await bcrypt.compare(password, updatedAdmin.password);
        console.log(`Verification Match: ${match}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

setAndCheck();
