const express = require('express');
const { body, param } = require('express-validator/check');

const pageController = require('../controllers/page');
const countryController = require('../controllers/country');
const cityController = require('../controllers/city');

const router = express.Router();

router.post('/country', [
    body('name', 'Ime države se smije sastojati samo od slova i razmaka!')
    .trim().isAlpha(),
    body('abbreviation', 'Kratica države se smije sastojati samo od slova i razmaka!')
    .trim().isAlpha(),
    body('currency', 'Valuta države se smije sastojati samo od slova!')
    .trim().isAlpha()
], countryController.postAddCountry);
router.get('/country', countryController.getAllCountries);
router.get('/country/:id', param('id', 'ID mora biti cijeli broj!'), countryController.getCountryById);
router.get('/citiesInCountry/:id', countryController.getAllCitiesInCountry);
router.post('/countryId', countryController.postGetIdByCountryName);
router.post('/country/:id', [
    param('id', 'ID mora biti cijeli broj!')
    // .isInt(),
    // body('name', 'Ime države se smije sastojati samo od slova i razmaka!')
    // .trim().isAlpha(),
    // body('abbreviation', 'Kratica države se smije sastojati samo od slova i razmaka!')
    // .trim().isAlpha(),
    // body('currency', 'Valuta države se smije sastojati samo od slova!')
    // .trim().isAlpha()
], countryController.postEditCountry);
router.delete('/country', body('id', 'ID mora biti cijeli broj!').isInt(), countryController.deleteCountry);

router.post('/city', cityController.postAddCity);
router.get('/city', cityController.getAllCities);
router.get('/city/:id', cityController.getCityById);
//router.get('/instructorsInCity/:id', cityController.getAllInstructorsInCity);
router.get('/facultiesInCity/:id', cityController.getAllFacultiesInCity);
router.post('/cityId', cityController.postGetIdByCityName);
router.post('/city/:id', cityController.postEditCity);
router.delete('/city', cityController.deleteCity);
//router.get('/instructors', pageController.postAddInstructor);
//router.get('/instructors/:id', pageController.getInstructorById);
// router.get('/instructorsAvailableToday', pageController.getInstructorsAvailableToday);
// router.get('/instructorsBestRanked', pageController.getBestRankedInstructors);

module.exports = router;
