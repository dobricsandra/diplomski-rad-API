const express = require('express');

const pageController = require('../controllers/page')
const router = express.Router();

router.get('/instructors', pageController.getAllInstructors);
router.get('/instructors/:id', pageController.getInstructorById);
// router.get('/instructorsAvailableToday', pageController.getInstructorsAvailableToday);
// router.get('/instructorsBestRanked', pageController.getBestRankedInstructors);

module.exports = router;
