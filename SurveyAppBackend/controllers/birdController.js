const BirdSurvey = require('../models/BirdSurvey');

// Helper function to generate random colors
const getRandomColor = () => {
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF', '#7BC225', '#E8C3B9'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Submit bird survey form (create or update)
exports.submitBirdSurvey = async (req, res) => {
  try {
    const surveyData = req.body;

    // Check if survey with uniqueId already exists
    const existingSurvey = await BirdSurvey.findOne({ uniqueId: surveyData.uniqueId });

    if (existingSurvey) {
      // Update existing
      const updated = await BirdSurvey.findOneAndUpdate(
        { uniqueId: surveyData.uniqueId },
        surveyData,
        { new: true }
      );
      return res.json({ _id: updated._id, uniqueId: updated.uniqueId, imageUri: updated.imageUri });
    }

    const survey = new BirdSurvey(surveyData);
    await survey.save();

    res.json({ _id: survey._id, uniqueId: survey.uniqueId, imageUri: survey.imageUri });
  } catch (error) {
    console.error('Bird survey form error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update bird survey form entry
exports.updateBirdSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const surveyData = req.body;

    const updated = await BirdSurvey.findByIdAndUpdate(id, surveyData, { new: true });

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Survey not found' });
    }

    res.json({ status: 'ok', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get all bird survey entries with pagination
exports.getAllBirdSurveys = async (req, res) => {
  try {
    const { email, page = 1, limit = 50 } = req.query;

    let query = {};
    if (email) {
      query.email = email.toLowerCase();
    }

    const surveys = await BirdSurvey.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(surveys);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get single bird survey entry by ID
exports.getBirdSurveyById = async (req, res) => {
  try {
    const { id } = req.params;
    const survey = await BirdSurvey.findById(id);

    if (!survey) {
      return res.status(404).json({ status: 'error', message: 'Survey not found' });
    }

    res.json(survey);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Delete bird survey entry
exports.deleteBirdSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    await BirdSurvey.findByIdAndDelete(id);
    res.json({ status: 'ok', message: 'Survey deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get bird species distribution (for dashboard)
exports.getBirdSpecies = async (req, res) => {
  try {
    const surveys = await BirdSurvey.find({});

    const speciesCount = {};
    surveys.forEach(survey => {
      if (survey.birdObservations) {
        survey.birdObservations.forEach(obs => {
          if (obs.species) {
            speciesCount[obs.species] = (speciesCount[obs.species] || 0) + parseInt(obs.count || 1);
          }
        });
      }
    });

    const data = Object.entries(speciesCount).map(([name, count]) => ({
      name,
      count,
      color: getRandomColor()
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get bird sex distribution
exports.getBirdSex = async (req, res) => {
  try {
    const surveys = await BirdSurvey.find({});

    const sexCount = { Male: 0, Female: 0, Unknown: 0 };
    surveys.forEach(survey => {
      if (survey.birdObservations) {
        survey.birdObservations.forEach(obs => {
          const sex = obs.sex || 'Unknown';
          sexCount[sex] = (sexCount[sex] || 0) + parseInt(obs.count || 1);
        });
      }
    });

    const data = Object.entries(sexCount).map(([name, count]) => ({
      name,
      count,
      color: getRandomColor()
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get habitat distribution
exports.getBirdHabitat = async (req, res) => {
  try {
    const surveys = await BirdSurvey.find({});

    const habitatCount = {};
    surveys.forEach(survey => {
      if (survey.habitatType) {
        habitatCount[survey.habitatType] = (habitatCount[survey.habitatType] || 0) + 1;
      }
    });

    const data = Object.entries(habitatCount).map(([name, count]) => ({
      name,
      count,
      color: getRandomColor()
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get point distribution
exports.getBirdPoint = async (req, res) => {
  try {
    const surveys = await BirdSurvey.find({});

    const pointCount = {};
    surveys.forEach(survey => {
      if (survey.point) {
        pointCount[survey.point] = (pointCount[survey.point] || 0) + 1;
      }
    });

    const data = Object.entries(pointCount).map(([name, count]) => ({
      name,
      count,
      color: getRandomColor()
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get bird count by month
exports.getBirdCountByMonth = async (req, res) => {
  try {
    const surveys = await BirdSurvey.find({});

    const monthlyCount = {};
    surveys.forEach(survey => {
      if (survey.date) {
        const month = survey.date.substring(0, 7); // YYYY-MM format
        let count = 0;
        if (survey.birdObservations) {
          survey.birdObservations.forEach(obs => {
            count += parseInt(obs.count || 1);
          });
        }
        monthlyCount[month] = (monthlyCount[month] || 0) + count;
      }
    });

    const data = Object.entries(monthlyCount)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Update image path for bird survey
exports.updateImagePath = async (req, res) => {
  try {
    const { id } = req.params;
    const { uri } = req.body;

    await BirdSurvey.findByIdAndUpdate(id, { imageUri: uri });

    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Post image path (for user profile or other uses)
exports.postImagePath = async (req, res) => {
  try {
    const { email, uri } = req.body;
    // This could update user profile image or other logic
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get bird survey statistics (for dashboard)
exports.getBirdStats = async (req, res) => {
  try {
    const total = await BirdSurvey.countDocuments();

    // Count by habitat type
    const byHabitat = await BirdSurvey.aggregate([
      { $group: { _id: '$habitatType', count: { $sum: 1 } } }
    ]);

    // Count by point
    const byPoint = await BirdSurvey.aggregate([
      { $group: { _id: '$point', count: { $sum: 1 } } }
    ]);

    // Count total bird observations
    const totalBirds = await BirdSurvey.aggregate([
      { $unwind: '$birdObservations' },
      { $group: { _id: null, count: { $sum: { $toInt: '$birdObservations.count' } } } }
    ]);

    res.json({
      total,
      totalBirdCount: totalBirds[0]?.count || 0,
      byHabitat,
      byPoint
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
