const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate random confirmation code
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register user
exports.register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ status: 'error', message: 'Passwords do not match' });
    }

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      if (user.isDeleted) {
        return res.json({ status: 'ok', isAccount: true, isDelete: true });
      }
      return res.json({ status: 'ok', isAccount: true, isDelete: false });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await user.save();

    res.json({ status: 'ok', data: user, isAccount: false, isDelete: false });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Send confirmation email
exports.sendConfirmationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const confirmationCode = generateCode();

    // Update user with confirmation code
    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { confirmationCode },
      { upsert: true }
    );

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'SurveyApp - Email Confirmation',
      html: `
        <h2>Email Confirmation</h2>
        <p>Your confirmation code is: <strong>${confirmationCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ status: 'ok', confirmationCode });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const resetCode = generateCode();

    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { confirmationCode: resetCode }
    );

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'SurveyApp - Password Reset',
      html: `
        <h2>Password Reset</h2>
        <p>Your reset code is: <strong>${resetCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ status: 'ok', message: 'Reset email sent' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Send email verification code (without actual email)
exports.sendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const code = generateCode();

    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { confirmationCode: code },
      { upsert: true }
    );

    res.json({ status: 'ok', confirmationCode: code });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Save PIN
exports.savePin = async (req, res) => {
  try {
    const { email, pin } = req.body;

    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { pin }
    );

    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'ok', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Delete account request
exports.deleteAccount = async (req, res) => {
  try {
    const { email } = req.body;

    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isDeleted: true, deleteRequestDate: new Date() }
    );

    res.json({ status: 'ok', message: 'Account deletion requested' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get team members
exports.getTeamMembers = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email: email.toLowerCase() });

    res.json({ teamMembers: user?.teamMembers || [] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Add/update user area
exports.addArea = async (req, res) => {
  try {
    const { email, area } = req.body;

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { area },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'ok', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update user profile (POST)
exports.updateProfile = async (req, res) => {
  try {
    const { email, name, area } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (area !== undefined) updateData.area = area;

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'ok', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Save or update team data
exports.saveOrUpdateTeamData = async (req, res) => {
  try {
    const { email, teamMembers } = req.body;

    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { teamMembers },
      { upsert: true }
    );

    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ status: 'error', data: 'User not found' });
    }

    if (user.isDeleted) {
      return res.json({ status: 'error', data: 'Account has been deleted' });
    }

    if (user.isGoogleLogin) {
      return res.json({ status: 'google', data: 'Please use Google Sign-In' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ status: 'error', data: 'Invalid password' });
    }

    if (!user.emailConfirmed) {
      return res.json({ status: 'notConfirmed', data: 'Email not confirmed' });
    }

    if (!user.isApproved) {
      return res.json({ status: 'notApproved', data: 'Account not approved by admin' });
    }

    res.json({ status: 'ok', data: user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Google register/login
exports.googleRegister = async (req, res) => {
  try {
    const { email, name, photo } = req.body;

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      if (user.isGoogleLogin) {
        return res.json({ status: 'google', data: user });
      } else {
        return res.json({ status: 'notgoogle', data: 'Account registered with email/password' });
      }
    }

    user = new User({
      email: email.toLowerCase(),
      password: 'google-auth',
      name: name || '',
      profileImage: photo || '',
      isGoogleLogin: true,
      emailConfirmed: true
    });

    await user.save();
    res.json({ status: 'ok', data: user });
  } catch (error) {
    console.error('Google register error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Email validation (confirm email)
exports.emailValidation = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { emailConfirmed: true, confirmationCode: null },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'ok', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get user validation (admin approval status)
exports.getUserValidation = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    if (user.isApproved) {
      res.json({ status: 'ok' });
    } else {
      res.json({ status: 'no' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Approve user (admin action)
exports.approveUser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isApproved: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Send approval notification email
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'SurveyApp - Account Approved',
        html: `
          <h2>Account Approved</h2>
          <p>Your account has been approved by the admin. You can now log in to the app.</p>
        `
      };
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
    }

    res.json({ status: 'ok', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Add username
exports.addUsername = async (req, res) => {
  try {
    const { email, name } = req.body;

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { name },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'ok', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get research area
exports.getResearchArea = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    if (user.researchAreas && user.researchAreas.length > 0) {
      res.json({ status: 'bird', data: user.researchAreas });
    } else {
      res.json({ status: 'none' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get name data
exports.getNameData = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({
      email: user.email,
      name: user.name,
      confirmEmail: user.emailConfirmed,
      profileImagePath: user.profileImage,
      area: user.area
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Save signup details (survey types, research areas, categories, personal details)
exports.saveSignupDetails = async (req, res) => {
  try {
    const {
      email, role, surveyTypes, researchAreas, periodicalCategories,
      firstName, lastName, nameWithInitials, mobileNumber,
      designation, institute, instituteAddress
    } = req.body;

    const updateData = {};
    if (role !== undefined) updateData.role = role;
    if (surveyTypes !== undefined) updateData.surveyTypes = surveyTypes;
    if (researchAreas !== undefined) updateData.researchAreas = researchAreas;
    if (periodicalCategories !== undefined) updateData.periodicalCategories = periodicalCategories;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (nameWithInitials !== undefined) updateData.nameWithInitials = nameWithInitials;
    if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber;
    if (designation !== undefined) updateData.designation = designation;
    if (institute !== undefined) updateData.institute = institute;
    if (instituteAddress !== undefined) updateData.instituteAddress = instituteAddress;

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'ok', data: user });
  } catch (error) {
    console.error('Save signup details error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get custom categories (habitat types, points, point tags)
exports.getCustomCategories = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email: email.toLowerCase() });

    res.json({
      customHabitatTypes: user?.customHabitatTypes || [],
      customPoints: user?.customPoints || [],
      customPointTags: user?.customPointTags || [],
      customVegetationStatuses: user?.customVegetationStatuses || [],
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Add a custom category value
exports.addCustomCategory = async (req, res) => {
  try {
    const { email, categoryType, value } = req.body;

    const validTypes = ['customHabitatTypes', 'customPoints', 'customPointTags', 'customVegetationStatuses'];
    if (!validTypes.includes(categoryType)) {
      return res.status(400).json({ status: 'error', message: 'Invalid category type' });
    }

    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $addToSet: { [categoryType]: value } }
    );

    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get pending users for admin approval
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false, emailConfirmed: true, isDeleted: false })
      .select('email name role firstName lastName institute createdAt');
    res.json({ status: 'ok', data: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
