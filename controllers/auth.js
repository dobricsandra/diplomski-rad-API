const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
   
    if(!errors.isEmpty()){
        console.log(errors);
        const error = new Error(errors.array()[0].msg);        
        error.statusCode = 422;
        throw error;
    }
   
    const email = req.body.email;
    const password = req.body.password;
    const isAdmin = 0; // TODO: set default:0 in model, and remove from here
    const name = req.body.name;
    const surname = req.body.surname;
    const phoneNumber =  req.body.phoneNumber;
    const picture =  req.body.picture;
    const facultyId = req.body.facultyId;
    const cityId = req.body.cityId;

    bcrypt.hash(password, 12) // TODO: chech what is recommanded value for salt
        .then(hashedPassword => {
            return hashedPassword;
        })
        .then(hashedPassword => {
            return  User.create({
                    email: email,
                    password: hashedPassword,
                    isAdmin: isAdmin,
                    name: name,
                    surname: surname,
                    phoneNumber: phoneNumber,
                    picture: picture,
                    facultyId: facultyId,
                    cityId: cityId
                    })
        })
        .then(result => {
            res.status(201).json(result);
            console.log("Novi korisnik uspješno dodan: " + result.name + " " + result.surname);
        })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            console.log(error);
            return next(error);
        });   
};

exports.login = (req, res, next) => {
    const errors = validationResult(req);
   
    if(!errors.isEmpty()){
        console.log(errors);
        const error = new Error(errors.array()[0].msg);        
        error.statusCode = 422;
        throw error;
    }
    
    const email = req.body.email;
    const password = req.body.password;

    let validUser;

    User.findOne( {where: { email: email } } )
        .then(user => {
            if(!user){
                const error = new Error('Pogrešna e-mail adresa ili lozinka!');
                error.statusCode = 401;
                return next(error);
            }
            validUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if(!isEqual){
                const error = new Error('Pogrešna e-mail adresa ili lozinka!');
                error.statusCode = 401;
                return next(error);
            }
            
            const token = jwt.sign({
                email: validUser.email,
                userId: validUser.id,
                isAdmin: validUser.isAdmin
            }, 'secret', { expiresIn: '1h' }); //TODO secret needs to be longer, fix it 
        
            console.log("Korisniku je dodijeljen JWT: " + token); 
            res.status(200).json({token: token, userId: validUser.id.toString(), expiresIn: '3600', isAdmin: validUser.isAdmin});
        })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            console.log(error);
            return next(error);
        });
};
