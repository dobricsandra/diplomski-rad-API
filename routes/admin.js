const express = require('express');
const { body, param } = require('express-validator/check');

const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const Country = require('../models/country');

const countryController = require('../controllers/country');
const cityController = require('../controllers/city');
const facultyController = require('../controllers/faculty');
const courseController = require('../controllers/course');
const userController = require('../controllers/user');
const instructorController = require('../controllers/instructor');
const degreeController = require('../controllers/degree');

const router = express.Router();

// country create, update, delete operations
router.post('/country',[
    body('name')
    .custom( (value, {req} ) => {
        return Country.findOne({name: value}).then( country => {
            if(country){
                return Promise.reject('Država s tim nazivom već postoji!');
            }
        }).catch();
    })
], isAuth, isAdmin,  countryController.postAddCountry);

router.post('/country/:id', isAuth, isAdmin, [
    body('name')
    .custom( (value, {req} ) => {
        return Country.findOne({name: value}).then( country => {
            if(country){
                return Promise.reject('Država s tim nazivom već postoji!');
            }
        }).catch();
    })
], countryController.postEditCountry);

router.delete('/country', isAuth, isAdmin, [
    body('id')
    .custom( (value, {req} ) => {
        return City.findOne({countryId: value}).then( city => {
            if(city){
                return Promise.reject('Ne možete obrisati državu! Prvo morate obrisati sve gradove!');
            }
        }).catch();
    })
], countryController.deleteCountry);

// city create, update, delete operations
router.post('/city', isAuth, isAdmin, [
    body('name')
    .custom( (value, {req} ) => {
        return City.findOne({name: value}).then( city => {
            if(!city){
                return Promise.reject('Grad s ovim imenom već postoji!');
            }
        }).catch();
    })
], cityController.postAddCity);

router.post('/city/:id', isAuth, isAdmin, [
    body('name')
    .custom( (value, {req} ) => {
        return City.findOne({name: value}).then( city => {
            if(!city){
                return Promise.reject('Grad s ovim imenom već postoji!');
            }
        }).catch();
    })
], cityController.postEditCity);

router.delete('/city', isAuth, isAdmin, [
    body('id')
    .custom( (value, {req} ) => {
        return User.findOne({cityId: value}).then( user => {
            if(!user){
                return Promise.reject('Ne možete obrisati ovaj grad jer postoje korisnici u njemu!');
            }
        }).catch();
    })
], cityController.deleteCity);

// faculty create, update, delete operations
router.post('/faculty', isAuth, isAdmin, [
    body('name')
    .custom( (value, {req} ) => {
        return Faculty.findOne({name: value}).then( faculty => {
            if(!faculty){
                return Promise.reject('Fakultet s ovim imenom već postoji!');
            }
        }).catch();
    })
], facultyController.postAddFaculty);

router.post('/faculty/:id', isAuth, isAdmin, [
    body('name')
    .custom( (value, {req} ) => {
        return Faculty.findOne({name: value}).then( faculty => {
            if(!faculty){
                return Promise.reject('Fakultet s ovim imenom već postoji!');
            }
        }).catch();
    })
], facultyController.postEditFaculty);

router.delete('/faculty', isAuth, isAdmin, [
    body('id')
    .custom( (value, {req} ) => {
        return User.findOne({facultyId: value}).then( user => {
            if(!user){
                return Promise.reject('Ne možete obrisati ovaj fakultet jer postoje korisnici na njemu!');
            }
        }).catch();
    })
], facultyController.deleteFaculty);

// course create, update, delete operations
router.post('/course', isAuth, isAdmin, [
    body('name')
    .custom( (value, {req} ) => {
        return Course.findOne({name: value}).then( course => {
            if(!course){
                return Promise.reject('Ne možete obrisati ovaj fakultet jer postoje korisnici na njemu!');
            }
        }).catch();
    })
], courseController.postAddCourse);

router.post('/course/:id', isAuth, isAdmin, courseController.postEditCourse);

router.delete('/course', isAuth, isAdmin, courseController.deleteCourse);

router.post('/user', isAuth, isAdmin, userController.postAddUser);
router.post('/user/:id', isAuth, isAdmin, userController.postEditUser);
router.delete('/user', isAuth, isAdmin, userController.deleteUser);

router.post('/instructor', isAuth, isAdmin, instructorController.postAddInstructor);
router.post('/instructor/:id', isAuth, isAdmin, instructorController.postEditInstructor);
router.delete('/instructor', isAuth, isAdmin, instructorController.deleteInstructor);
router.post('/degree', isAuth, isAdmin, degreeController.postAddDegree);
router.post('/degree/:id', isAuth, isAdmin, degreeController.postEditDegree);
router.delete('/degree', isAuth, isAdmin, degreeController.deleteDegree);

module.exports = router;