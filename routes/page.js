const express = require('express');

const isAuth = require('../middleware/is-auth');

const countryController = require('../controllers/country');
const cityController = require('../controllers/city');
const facultyController = require('../controllers/faculty');
const courseController = require('../controllers/course');
const userController = require('../controllers/user');
const instructorController = require('../controllers/instructor');
const degreeController = require('../controllers/degree');
const reviewController = require('../controllers/review');

const router = express.Router();

// countries read operations
router.get('/countries', countryController.getAllCountries);
router.get('/countries/:id', countryController.getCountryById);
router.get('/countries/:id/cities', countryController.getAllCitiesInCountry);

// cities read operations
router.get('/cities', cityController.getAllCities);
router.get('/cities/:id', cityController.getCityById);
router.get('/cities/:id/faculties', cityController.getAllFacultiesInCity);
router.get('/cities/:id/users', cityController.getAllUsersInCity);

// degrees read operations
router.get('/degrees', degreeController.getAllDegrees);
router.get('/degrees/:id', degreeController.getDegreeById);

// users read operations
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);

// TODO: wtf? what was this? why? is it used anywhere?
router.post('/ej', isAuth, courseController.addCoursesToInstructor);

// faculties read operations
router.get('/faculties', facultyController.getAllFaculties);
router.get('/faculties/:id', facultyController.getFacultyById);
router.get('/faculties/:id/courses', facultyController.getAllCoursesOnFaculty);
//router.get('/usersOnFaculty/:id', facultyController.getAllUsersOnFaculty);

// courses read operations
router.get('/courses', courseController.getAllCourses);
router.get('/courses/:id', courseController.getCourseById);
router.get('/courses/:id/instructors', courseController.getAllInstructorsForCourse);
router.get('/instructors/courses', isAuth, courseController.getAllCoursesForInstructor);

// instructors read operations
router.get('/instructors', instructorController.getAllInstructors);
router.get('/instructors/:id', instructorController.getInstructorById);

// reviews CRUD operations - why here? why not in user?
router.post('/reviews/:id', isAuth, reviewController.postAddReview);
router.get('/reviews/:id', reviewController.getAllReviewsForInstructor);
router.get('/getReviewFromUser/:id', isAuth, reviewController.getReviewFromUserToInstructor);
router.post('/editreview/:id', isAuth, reviewController.postEditReview);
router.delete('/reviews', isAuth, reviewController.deleteReview);

//router.get('/instructors', pageController.postAddInstructor);
//router.get('/instructors/:id', pageController.getInstructorById);
// router.get('/instructorsAvailableToday', pageController.getInstructorsAvailableToday);
// router.get('/instructorsBestRanked', pageController.getBestRankedInstructors);

module.exports = router;
