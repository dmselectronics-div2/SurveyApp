const express = require('express');
const router = express.Router();
const citizenController = require('../controllers/citizenController');

// ==================== PLANT ROUTES ====================
router.post('/plants', citizenController.createPlant);
router.get('/plants', citizenController.getAllPlants);
router.get('/plants/:id', citizenController.getPlantById);
router.put('/plants/:id', citizenController.updatePlant);
router.delete('/plants/:id', citizenController.deletePlant);

// ==================== ANIMAL ROUTES ====================
router.post('/animals', citizenController.createAnimal);
router.get('/animals', citizenController.getAllAnimals);
router.get('/animals/:id', citizenController.getAnimalById);
router.put('/animals/:id', citizenController.updateAnimal);
router.delete('/animals/:id', citizenController.deleteAnimal);

// ==================== NATURE ROUTES ====================
router.post('/nature', citizenController.createNature);
router.get('/nature', citizenController.getAllNature);
router.get('/nature/:id', citizenController.getNatureById);
router.put('/nature/:id', citizenController.updateNature);
router.delete('/nature/:id', citizenController.deleteNature);

// ==================== HUMAN ACTIVITY ROUTES ====================
router.post('/human-activity', citizenController.createHumanActivity);
router.get('/human-activity', citizenController.getAllHumanActivity);
router.get('/human-activity/:id', citizenController.getHumanActivityById);
router.put('/human-activity/:id', citizenController.updateHumanActivity);
router.delete('/human-activity/:id', citizenController.deleteHumanActivity);

module.exports = router;
