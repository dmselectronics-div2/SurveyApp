const PlantObservation = require('../models/PlantObservation');
const AnimalObservation = require('../models/AnimalObservation');
const NatureObservation = require('../models/NatureObservation');
const HumanActivity = require('../models/HumanActivityObservation');

// ==================== PLANT CONTROLLER ====================

exports.createPlant = async (req, res) => {
  try {
    const plant = new PlantObservation(req.body);
    await plant.save();
    res.json({ status: 'ok', data: plant, _id: plant._id });
  } catch (error) {
    console.error('Plant creation error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAllPlants = async (req, res) => {
  try {
    const { userId, page = 1, limit = 50 } = req.query;
    let query = {};
    if (userId) query.userId = userId;

    const plants = await PlantObservation.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await PlantObservation.countDocuments(query);

    res.json({
      data: plants,
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

exports.getPlantById = async (req, res) => {
  try {
    const plant = await PlantObservation.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ status: 'error', message: 'Plant not found' });
    }
    res.json(plant);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updatePlant = async (req, res) => {
  try {
    const updated = await PlantObservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Plant not found' });
    }
    res.json({ status: 'ok', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deletePlant = async (req, res) => {
  try {
    await PlantObservation.findByIdAndDelete(req.params.id);
    res.json({ status: 'ok', message: 'Plant deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ==================== ANIMAL CONTROLLER ====================

exports.createAnimal = async (req, res) => {
  try {
    const animal = new AnimalObservation(req.body);
    await animal.save();
    res.json({ status: 'ok', data: animal, _id: animal._id });
  } catch (error) {
    console.error('Animal creation error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAllAnimals = async (req, res) => {
  try {
    const { userId, page = 1, limit = 50 } = req.query;
    let query = {};
    if (userId) query.userId = userId;

    const animals = await AnimalObservation.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await AnimalObservation.countDocuments(query);

    res.json({
      data: animals,
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

exports.getAnimalById = async (req, res) => {
  try {
    const animal = await AnimalObservation.findById(req.params.id);
    if (!animal) {
      return res.status(404).json({ status: 'error', message: 'Animal not found' });
    }
    res.json(animal);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateAnimal = async (req, res) => {
  try {
    const updated = await AnimalObservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Animal not found' });
    }
    res.json({ status: 'ok', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteAnimal = async (req, res) => {
  try {
    await AnimalObservation.findByIdAndDelete(req.params.id);
    res.json({ status: 'ok', message: 'Animal deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ==================== NATURE CONTROLLER ====================

exports.createNature = async (req, res) => {
  try {
    const nature = new NatureObservation(req.body);
    await nature.save();
    res.json({ status: 'ok', data: nature, _id: nature._id });
  } catch (error) {
    console.error('Nature creation error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAllNature = async (req, res) => {
  try {
    const { userId, page = 1, limit = 50 } = req.query;
    let query = {};
    if (userId) query.userId = userId;

    const observations = await NatureObservation.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await NatureObservation.countDocuments(query);

    res.json({
      data: observations,
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

exports.getNatureById = async (req, res) => {
  try {
    const nature = await NatureObservation.findById(req.params.id);
    if (!nature) {
      return res.status(404).json({ status: 'error', message: 'Nature observation not found' });
    }
    res.json(nature);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateNature = async (req, res) => {
  try {
    const updated = await NatureObservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Nature observation not found' });
    }
    res.json({ status: 'ok', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteNature = async (req, res) => {
  try {
    await NatureObservation.findByIdAndDelete(req.params.id);
    res.json({ status: 'ok', message: 'Nature observation deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ==================== HUMAN ACTIVITY CONTROLLER ====================

exports.createHumanActivity = async (req, res) => {
  try {
    const activity = new HumanActivity(req.body);
    await activity.save();
    res.json({ status: 'ok', data: activity, _id: activity._id });
  } catch (error) {
    console.error('Human activity creation error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getAllHumanActivity = async (req, res) => {
  try {
    const { userId, page = 1, limit = 50 } = req.query;
    let query = {};
    if (userId) query.userId = userId;

    const activities = await HumanActivity.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await HumanActivity.countDocuments(query);

    res.json({
      data: activities,
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

exports.getHumanActivityById = async (req, res) => {
  try {
    const activity = await HumanActivity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ status: 'error', message: 'Human activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateHumanActivity = async (req, res) => {
  try {
    const updated = await HumanActivity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Human activity not found' });
    }
    res.json({ status: 'ok', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteHumanActivity = async (req, res) => {
  try {
    await HumanActivity.findByIdAndDelete(req.params.id);
    res.json({ status: 'ok', message: 'Human activity deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
