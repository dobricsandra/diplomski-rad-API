const express = require('express');
const { body, param } = require('express-validator/check');

const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const Country = require('../models/country');
const City = require('../models/city');
const User = require('../models/user');
const Instructor = require('../models/instructor');
const Degree = require('../models/degree');

const countryController = require('../controllers/country');
const cityController = require('../controllers/city');
const facultyController = require('../controllers/faculty');
const courseController = require('../controllers/course');
const userController = require('../controllers/user');
const instructorController = require('../controllers/instructor');
const degreeController = require('../controllers/degree');

const router = express.Router();

// country create, update, delete operations
router.post('/country', isAuth, isAdmin, [
    body('name')
        .not().isEmpty().withMessage('Naziv države ne može biti prazan!')
        .isLength( { min: 3 } ).withMessage('Naziv države ne može biti kraći od 3 znaka!')
        .custom( (value, { req } ) => {
            return Country.findOne( { where: { name: value } } ).then( country => {
                if(country){
                    return Promise.reject('Država s tim nazivom već postoji!');
                }
            }).catch();
        }),
    body('abbreviation')
        .not().isEmpty().withMessage('Kratica naziva države ne može biti prazna!')
        .isLength( {max: 10 } ).withMessage('Kratica naziva države ne može biti dulja od 10 znakova!'),
    body('currency')
        .not().isEmpty().withMessage('Valuta države ne može biti prazna!')
        .isLength( { min:2, max: 10 } ).withMessage('Valuta države mora imati minalno 2, a maksimalno 10 znakova!')

], countryController.postAddCountry);

router.post('/country/:id',  isAuth, isAdmin, [
    body('name')
        .not().isEmpty().withMessage('Naziv države ne može biti prazan!')
        .isLength( { min:3 } ).withMessage('Naziv države ne može biti kraći od 3 znaka!'),
        // .custom( (value, {req} ) => {
        //     return Country.findOne( { where: { name: value } } ).then( country => {
        //         if(country){
        //             return Promise.reject('Država s tim nazivom već postoji!');
        //         }
        //     }).catch();
        // }),
    body('abbreviation')
        .not().isEmpty().withMessage('Kratica naziva države ne može biti prazna!')
        .isLength( {max: 10 } ).withMessage('Kratica naziva države ne može biti dulja od 10 znakova!'),
    body('currency')
        .not().isEmpty().withMessage('Valuta države ne može biti prazna!')
        .isLength( { min:2, max: 10 } ).withMessage('Valuta države mora imati minalno 2, a maksimalno 10 znakova!')

], countryController.postEditCountry);

router.delete('/country', isAuth, isAdmin, [
    body('id')
    .custom( (value, {req} ) => {
        return City.findOne( { where: { countryId: value } } ).then( city => {
            if(city){
                return Promise.reject('Ne možete obrisati državu! Prvo morate obrisati sve gradove!');
            }
        }).catch();
    })
], countryController.deleteCountry);

// city create, update, delete operations
router.post('/city', isAuth, isAdmin, [
    body('postalCode')
        .not().isEmpty().withMessage("Poštanski broj ne smije biti prazan!")
        .isLength( { min: 5 } ).withMessage('Poštanski broj ne može biti kraći od 5 znakova!')
        .isNumeric().withMessage("Neispravan format poštanskog broja!")
        .custom( (value, {req} ) => {
            return City.findOne( { where: { postalCode: value } } ).then( city => {
                if(city){
                    return Promise.reject('Grad s ovim poštanskim brojem već postoji!');
                }
            }).catch();
        }),
    body('name')
        .not().isEmpty().withMessage("Ime grada ne smije biti prazno!")
        .custom( (value, {req} ) => {
            return City.findOne( { where: { name: value } } ).then( city => {
                if(city){
                    return Promise.reject('Grad s ovim imenom već postoji!');
                }
            }).catch();
        }),
    body('countryId')
        .not().isEmpty().withMessage("Morate odabrati državu kojoj grad pripada!")
        .isInt().isInt("CountryId mora biti cijeli broj (INT)")
        .custom( (value, {req} ) => {
            return Country.findOne( { where: { id: value } } ).then( country => {
                if(!country){
                    return Promise.reject('Ne postoji država s odabranim ID-jem!');
                }
            }).catch();
        })
], cityController.postAddCity);

router.post('/city/:id', isAuth, isAdmin, [
    body('postalCode')
        .not().isEmpty().withMessage("Poštanski broj ne smije biti prazan!")
        .isLength( { min: 5 } ).withMessage('Poštanski broj ne može biti kraći od 5 znakova!')
        .isNumeric().withMessage("Neispravan format poštanskog broja!"),
        // .custom( (value, {req} ) => {
        //     return City.findOne( { where: { postalCode: value } } ).then( city => {
        //         if(city){
        //             return Promise.reject('Grad s ovim poštanskim brojem već postoji!');
        //         }
        //     }).catch();
        // }),
    body('name')
        .not().isEmpty().withMessage("Ime grada ne smije biti prazno!"),
        // .custom( (value, {req} ) => {
        //     return City.findOne( { where: { name: value } } ).then( city => {
        //         if(city){
        //             return Promise.reject('Grad s ovim imenom već postoji!');
        //         }
        //     }).catch();
        // }),
], cityController.postEditCity);

router.delete('/city', isAuth, isAdmin, [
    body('id')
        .custom( (value, {req} ) => {
            return User.findOne( { where: { cityId: value } } ).then( user => {
                if(user){
                    return Promise.reject('Ne možete obrisati ovaj grad jer postoje korisnici u njemu!');
                }
            }).catch();
        })
], cityController.deleteCity);

// degree create, update and delete operations

router.post('/degree', isAuth, isAdmin, [
    body('name')
        .not().isEmpty().withMessage("Naziv titule ne smije biti prazan!")
        .isLength( { min: 5 } ).withMessage('Naziv titule ne može biti kraći od 5 znakova!')
        .custom( (value, {req} ) => {
            return Degree.findOne( { where: { name: value } } ).then( degree => {
                if(degree){
                    return Promise.reject('Titula s ovim nazivom već postoji!');
                }
            }).catch();
        }),
    body('abbreviation')
    .not().isEmpty().withMessage("Kratica titule ne smije biti prazna!")
    .custom( (value, {req} ) => {
        return Degree.findOne( { where: { abbreviation: value } } ).then( degree => {
            if(degree){
                return Promise.reject('Titula s ovom kraticom već postoji!');
            }
        }).catch();
    }),
], degreeController.postAddDegree);

router.post('/degree/:id', isAuth, isAdmin, [
    body('name')
        .not().isEmpty().withMessage("Naziv titule ne smije biti prazan!")
        .isLength( { min: 5 } ).withMessage('Naziv titule ne može biti kraći od 5 znakova!'),
    body('abbreviation')
    .not().isEmpty().withMessage("Kratica titule ne smije biti prazna!"),
], degreeController.postEditDegree);

router.delete('/degree', isAuth, isAdmin, [
    body('id')
        .custom( (value, {req} ) => {
            return Instructor.findOne( { where: { degreeId: value } } ).then( instructor => {
                if(instructor){
                    return Promise.reject('Ne možete obrisati ovu titulu jer postoje korisnici s njom!');
                }
            }).catch();
        })
], degreeController.deleteDegree);

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




module.exports = router;