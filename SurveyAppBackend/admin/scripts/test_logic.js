const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../../models/User');

const testLoginLogic = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('DB Connected');

        const email = 'admin@test.com'; // Change to what the user is using
        const password = '123';

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log('User not found');
            return;
        }

        console.log('Found user:', user.email);
        console.log('Hash in DB:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Is match:', isMatch);

        process.exit(0);
    } catch (err) {
        console.error('Logic Error:', err);
        process.exit(1);
    }
};

testLoginLogic();
