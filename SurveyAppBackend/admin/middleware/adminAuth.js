const Admin = require('../models/Admin');

/**
 * Middleware to verify that the requesting user is an admin.
 * Note: This assumes you are passing the user email/ID in the request 
 * or have already verified a JWT token.
 */
const adminAuth = async (req, res, next) => {
    try {
        const email = req.headers['x-user-email'] || req.body.email || req.query.email;

        if (!email) {
            console.log('❌ Admin Auth: No email header provided');
            return res.status(401).json({ status: 'error', message: 'Authentication required' });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase() });

        if (!admin) {
            console.log(`❌ Admin Auth: No admin record found for ${email}`);
            return res.status(403).json({
                status: 'error',
                message: 'Access denied. Admin privileges required.'
            });
        }

        console.log(`✅ Admin Auth: Verified ${email}`);
        req.adminUser = admin;
        next();
    } catch (error) {
        console.error('🔥 Admin Auth Middleware Error:', error);
        res.status(500).json({ status: 'error', message: 'Auth middleware error' });
    }
};

module.exports = adminAuth;
