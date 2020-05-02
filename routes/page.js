const express = require('express');

const pageController = require('../controllers/page');
const countryController = require('../controllers/country');
const router = express.Router();

router.post('/country', countryController.postAddCountry);
router.get('/country', countryController.getAllCountries);
router.get('/country/:id', countryController.getCountryById);
//router.get('/instructors', pageController.postAddInstructor);
//router.get('/instructors/:id', pageController.getInstructorById);
// router.get('/instructorsAvailableToday', pageController.getInstructorsAvailableToday);
// router.get('/instructorsBestRanked', pageController.getBestRankedInstructors);

module.exports = router;
