const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Admin = require('../models/Admin');

async function debugAuth() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const email = 'shamikadulana345@gmail.com';
        const passwordToTest = 'admin123';

        const admin = await Admin.findOne({ email: email.toLowerCase() });

        if (!admin) {
            console.log(`❌ Admin ${email} not found`);
            process.exit(1);
        }

        console.log(`🔍 Found Admin: ${admin.email}`);
        console.log(`🔍 Hash in DB: ${admin.password}`);

        const isMatch = await bcrypt.compare(passwordToTest, admin.password);
        console.log(`🤔 Bcrypt comparison with '${passwordToTest}': ${isMatch}`);

        // Let's try to verify if it's a valid bcrypt hash
        const isValidHash = admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$');
        console.log(`📏 Is start with $2a$ or $2b$: ${isValidHash}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debugAuth();
