const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth')

const router = express.Router();

router.post('/signup', [
    body('email')
        .isEmail().withMessage('Unesite ispravan mail!')
        .isLength( { min: 5 } ).withMessage('E-mail adresa je prekratka!')
        .custom( (value, {req} ) => {
            return User.findOne({where: {email: value}}).then( userDoc => {
                if(userDoc){
                    console.log("Postoji već korisnik s mailom " + value);
                    return Promise.reject("Postoji već korisnik s tim mailom! Molimo Vas, upišite novi mail");
                }
            });
        }),
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
], authController.signup);

router.post('/login', [
    body('email')
        .isEmail().withMessage('Unesite ispravan mail!')
        .isLength( { min: 5 } ).withMessage('E-mail adresa je prekratka!'),
    body('password')
        .isLength( { min: 6 } ).withMessage('Lozinka mora imati najmanje 6 znakova!')
], authController.login);

module.exports = router;