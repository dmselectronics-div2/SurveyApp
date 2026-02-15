const CitizenForm = require('../models/CitizenForm');

// Submit citizen form
exports.submitCitizenForm = async (req, res) => {
  try {
    const form = new CitizenForm(req.body);
    await form.save();
    res.json({ status: 'ok', data: form, _id: form._id });
  } catch (error) {
    console.error('Citizen form error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get all citizen form entries
exports.getAllCitizenForms = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const forms = await CitizenForm.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await CitizenForm.countDocuments();

    res.json({
      data: forms,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
