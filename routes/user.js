const express = require('express');
const { body, param } = require('express-validator/check');

const isAuth = require('../middleware/is-auth');

const User = require('../models/user');
const Instructor = require('../models/instructor');
const Degree = require('../models/degree');

const userController = require('../controllers/user');
const instructorController = require('../controllers/instructor');
const reviewController = require('../controllers/review');


const router = express.Router();

router.post('/user/:id', isAuth, [
    body('email')
        .isEmail().withMessage('Unesite ispravan mail!')
        .isLength( { min: 5 } ).withMessage('E-mail adresa je prekratka!'),
    body('password')
        .isLength( { min: 6 } ).withMessage('Lozinka mora imati najmanje 6 znakova!'),
    body('phoneNumber')
        .isMobilePhone().withMessage('Unijeli ste neispravan broj mobitela!'),
    body('name')
        .not().isEmpty().withMessage('Ime ne može biti prazno!'),
    body('surname')
        .not().isEmpty().withMessage('Prezime ne može biti prazno!'),
    body('facultyId')
        .not().isEmpty().withMessage('Fakultet ne može biti prazan!')
        .isInt().withMessage('Došlo je do pogreške!'),
    body('cityId')
        .not().isEmpty().withMessage('Grad ne može biti prazan!')
        .isInt().withMessage('Došlo je do pogreške!')

], userController.postEditUser);

router.delete('/user/', isAuth, userController.deleteUser);

router.post('/instructor', isAuth, [
    body('address')
        .not().isEmpty().withMessage('Adresa ne može biti prazna!')
        .isLength( { min: 5 } ).withMessage('Adresa je prekratka!'),
    body('description')
        .isLength( { max: 255 } ).withMessage('Opis je predug! Ograničite se na 255 znakova!'),
    body('degreeId')
        .custom( (value, {req} ) => {
            if(value) {
            return Degree.findOne( { where: { id: value } } ).then( degree => {
                if(!degree){
                    return Promise.reject('Ne postoji titula s odabranim ID-jem!');
                }
            }).catch();
            }
        })
], instructorController.postAddInstructor);

router.post('/instructor/:id', isAuth, [
    body('address')
        .not().isEmpty().withMessage('Adresa ne može biti prazna!')
        .isLength( { min: 5 } ).withMessage('Adresa je prekratka!'),
    body('description')
        .isLength( { max: 255 } ).withMessage('Opis je predug! Ograničite se na 255 znakova!'),
    body('degreeId')
        .custom( (value, {req} ) => {
            if(value) {
            return Degree.findOne( { where: { id: value } } )
            .then( degree => {
                if(!degree){
                    return Promise.reject('Ne postoji titula s odabranim ID-jem!');
                }
            })
            }
        })
], instructorController.postEditInstructor);

router.delete('/instructor', isAuth, instructorController.deleteInstructor);

router.get('/review/:id', reviewController.getAllReviewsForInstructor);

module.exports = router;