const Admin = require('../models/Admin');
const User = require('../../models/User');
const BirdSurvey = require('../../models/BirdSurvey');
const BivalviSurvey = require('../../models/BivalviSurvey');
const CitizenForm = require('../../models/CitizenForm');
const bcrypt = require('bcryptjs');

// Admin Login
exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (email) email = email.trim().toLowerCase();
        if (password) password = password.trim();

        console.log(`🔑 Login Attempt for: ${email} (Password length: ${password?.length || 0})`);

        const admin = await Admin.findOne({ email });

        if (!admin) {
            console.log(`❌ Login Failed: Admin ${email} not found`);
            return res.status(404).json({ status: 'error', message: 'Admin account not found' });
        }

        console.log(`🔍 Found Admin record. Comparing passwords...`);
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.log(`❌ Login Failed: Invalid password for ${email}`);
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        console.log(`✅ Login Success: ${email}`);
        res.json({ status: 'ok', data: admin });
    } catch (error) {
        console.error('🔥 Login Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Admin Registration (The first one becomes Super Admin)
exports.register = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (email) email = email.trim().toLowerCase();
        if (password) password = password.trim();

        if (!password || password.length < 6) {
            return res.status(400).json({ status: 'error', message: 'Password must be at least 6 characters long' });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ status: 'error', message: 'Admin already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminCount = await Admin.countDocuments();

        const admin = new Admin({
            email: email.toLowerCase(),
            password: hashedPassword,
            isSuperAdmin: adminCount === 0 // First one is the boss
        });

        await admin.save();
        res.json({ status: 'ok', data: admin });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Get high-level statistics for the dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ isDeleted: false });
        const pendingUsers = await User.countDocuments({ isApproved: false, emailConfirmed: true });

        const birdSurveys = await BirdSurvey.countDocuments();
        const bivalviSurveys = await BivalviSurvey.countDocuments();
        const citizenReports = await CitizenForm.countDocuments();

        // Get current month and previous month ranges
        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Helper to get count for a range
        const getRangeCount = async (model, start, end) => {
            return await model.countDocuments({ createdAt: { $gte: start, $lt: end } });
        };

        // Helper to calculate percentage change
        const calculateChange = (current, previous) => {
            if (previous === 0) return current > 0 ? '+100%' : '0%';
            const change = ((current - previous) / previous) * 100;
            return (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
        };

        const [
            currentUsers, lastUsers,
            currentBird, lastBird,
            currentBivalvi, lastBivalvi,
            currentCitizen, lastCitizen
        ] = await Promise.all([
            getRangeCount(User, startOfCurrentMonth, now), getRangeCount(User, startOfLastMonth, endOfLastMonth),
            getRangeCount(BirdSurvey, startOfCurrentMonth, now), getRangeCount(BirdSurvey, startOfLastMonth, endOfLastMonth),
            getRangeCount(BivalviSurvey, startOfCurrentMonth, now), getRangeCount(BivalviSurvey, startOfLastMonth, endOfLastMonth),
            getRangeCount(CitizenForm, startOfCurrentMonth, now), getRangeCount(CitizenForm, startOfLastMonth, endOfLastMonth)
        ]);

        const changes = {
            users: calculateChange(currentUsers, lastUsers),
            bird: calculateChange(currentBird, lastBird),
            bivalvi: calculateChange(currentBivalvi, lastBivalvi),
            citizen: calculateChange(currentCitizen, lastCitizen)
        };

        // Calculate trends for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const trendData = [];

        for (let i = 0; i < 6; i++) {
            const date = new Date(sixMonthsAgo);
            date.setMonth(sixMonthsAgo.getMonth() + i);
            const monthName = months[date.getMonth()];

            const startOfMonth = new Date(date);
            const endOfMonth = new Date(date);
            endOfMonth.setMonth(date.getMonth() + 1);

            const [userCount, birdCount, bivalviCount, citizenCount] = await Promise.all([
                User.countDocuments({ createdAt: { $gte: startOfMonth, $lt: endOfMonth }, isDeleted: false }),
                BirdSurvey.countDocuments({ createdAt: { $gte: startOfMonth, $lt: endOfMonth } }),
                BivalviSurvey.countDocuments({ createdAt: { $gte: startOfMonth, $lt: endOfMonth } }),
                CitizenForm.countDocuments({ createdAt: { $gte: startOfMonth, $lt: endOfMonth } })
            ]);

            trendData.push({
                name: monthName,
                value: userCount + birdCount + bivalviCount + citizenCount,
                users: userCount,
                surveys: birdCount + bivalviCount + citizenCount
            });
        }

        res.json({
            status: 'ok',
            data: {
                stats: {
                    totalUsers,
                    pendingUsers,
                    birdSurveys,
                    bivalviSurveys,
                    citizenReports,
                    changes
                },
                trends: trendData
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Get all users with filtering
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: false })
            .select('-password -pin')
            .sort({ createdAt: -1 });

        res.json({ status: 'ok', data: users });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Approve a specific user
exports.approveUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(userId, { isApproved: true }, { new: true });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        res.json({ status: 'ok', message: 'User approved successfully', data: user });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Get all Bird Surveys
exports.getBirdSurveys = async (req, res) => {
    try {
        const surveys = await BirdSurvey.find().sort({ createdAt: -1 });
        res.json({ status: 'ok', data: surveys });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Get all Bivalvi Surveys
exports.getBivalviSurveys = async (req, res) => {
    try {
        const surveys = await BivalviSurvey.find().sort({ createdAt: -1 });
        res.json({ status: 'ok', data: surveys });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Get all Citizen reports
exports.getCitizenSurveys = async (req, res) => {
    try {
        const surveys = await CitizenForm.find().sort({ createdAt: -1 });
        res.json({ status: 'ok', data: surveys });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
