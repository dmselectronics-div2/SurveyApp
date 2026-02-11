const express = require('express');
const router = express.Router();
const birdController = require('../controllers/birdController');

// CRUD Operations
router.post('/form-entry', birdController.submitBirdSurvey);
router.put('/form-entry/:id', birdController.updateBirdSurvey);
router.get('/form-entries', birdController.getAllBirdSurveys);
router.get('/form-entry/:id', birdController.getBirdSurveyById);
router.delete('/form-entry/:id', birdController.deleteBirdSurvey);

// Analytics/Dashboard routes
router.get('/bird-species', birdController.getBirdSpecies);
router.get('/bird-sex', birdController.getBirdSex);
router.get('/bird-habitat', birdController.getBirdHabitat);
router.get('/bird-point', birdController.getBirdPoint);
router.get('/bird-count-by-month', birdController.getBirdCountByMonth);
router.get('/bird-stats', birdController.getBirdStats);

// Image routes
router.put('/post-image-path-form/:id', birdController.updateImagePath);
router.post('/post-image-path', birdController.postImagePath);

module.exports = router;
