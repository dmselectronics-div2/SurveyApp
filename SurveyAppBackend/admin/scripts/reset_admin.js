const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Admin = require('../models/Admin');

async function resetPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const email = 'shamikadulana345@gmail.com';
        const newPassword = 'admin123';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const result = await Admin.findOneAndUpdate(
            { email: email.toLowerCase() },
            { password: hashedPassword },
            { new: true }
        );

        if (result) {
            console.log(`✅ Password reset successfully for ${email}`);
            console.log(`New Password: ${newPassword}`);
        } else {
            console.log(`❌ Admin ${email} not found`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

resetPassword();
