const express = require('express');
//const { body, param } = require('express-validator/check');

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

router.get('/country', countryController.getAllCountries);
router.get('/country/:id', countryController.getCountryById);
router.get('/country/:id/cities', countryController.getAllCitiesInCountry);

router.get('/city', cityController.getAllCities);
router.get('/city/:id', cityController.getCityById);
router.get('/city/:id/faculties', cityController.getAllFacultiesInCity);
router.get('/city/:id/users', cityController.getAllUsersInCity);

router.get('/degree', degreeController.getAllDegrees);
router.get('/degree/:id', degreeController.getDegreeById);

router.get('/user', userController.getAllUsers);
router.get('/user/:id', userController.getUserById);

router.post('/ej', isAuth, courseController.addCoursesToInstructor);






router.get('/faculty', facultyController.getAllFaculties);
router.get('/faculty/:id', facultyController.getFacultyById);
router.get('/coursesOnFaculty/:id', facultyController.getAllCoursesOnFaculty);
router.get('/usersOnFaculty/:id', facultyController.getAllUsersOnFaculty);
router.post('/facultyId', facultyController.postGetIdByFacultyName);



router.get('/course', courseController.getAllCourses);
router.get('/course/:id', courseController.getCourseById);
router.get('/instructorsForCourse/:id', courseController.getAllInstructorsForCourse);






router.get('/instructor', instructorController.getAllInstructors);
router.get('/instructor/:id', instructorController.getInstructorById);





router.post('/review/:id', isAuth, reviewController.postAddReview);
router.get('/reviews/:id', reviewController.getAllReviewsForInstructor);
router.get('/getReviewFromUser/:id', reviewController.getReviewFromUserToInstructor);
router.post('/review/:id', isAuth, reviewController.postEditReview);
router.delete('/review', isAuth, reviewController.deleteReview);

//router.get('/instructors', pageController.postAddInstructor);
//router.get('/instructors/:id', pageController.getInstructorById);
// router.get('/instructorsAvailableToday', pageController.getInstructorsAvailableToday);
// router.get('/instructorsBestRanked', pageController.getBestRankedInstructors);

module.exports = router;
