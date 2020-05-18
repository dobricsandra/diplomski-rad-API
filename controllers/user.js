const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const Course = require('../models/course');
const User = require('../models/user');
const Instructor = require('../models/instructor');
const Faculty = require('../models/faculty');
const Country = require('../models/country');
const City = require('../models/city');
const Term = require('../models/term');
const Reservation = require('../models/reservation');

exports.getAllUsers = (req, res, next) => {
  User.findAll()
    .then(result => {
      if (Object.keys(result).length == 0) {
        res.status(204).json("Ne postoji nijedan korisnik!");
        console.log("Ne postoji nijedan korisnik.");
      }
      res.status(200).json(result);
      console.log("Uspješno prikupljen popis korisnika.");
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(error);
      return next(error);
    });
};

exports.getUserById = (req, res, next) => {
  const id = req.params.id;
  User.findByPk(id).then(result => {
    if (result == null) {
      console.log("Ne postoji korisnik s ID-jem " + id);
      res.status(404).json("Ne postoji korisnik s ID-jem " + id);
      return;
    }
    console.log("Uspješno prikupljen popis korisnika.");
    res.status(200).json(result);
  })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(error);
      return next(error);
    });
};

// TODO: this doesn't look well. try to find some better solution
exports.getUserByIdDetails = (req, res, next) => {
  const id = req.params.id;
  User.findByPk(id).then(result => {
    if (result == null) {
      console.log("Ne postoji korisnik s ID-jem " + id);
      res.status(404).json("Ne postoji korisnik s ID-jem " + id);
      return;
    }
    return User.findOne({
      where: { id: id }, 
      include: [
        { model: Instructor }, 
        { model: City, include: { model: Country }}, 
        { model: Faculty }, 
        { model: Reservation, include: { model: Term, include: { model: Instructor, include: User } } }
      ]})
      .then(result => {
        console.log("Uspješno prikupljeni svi podaci o korisniku.");
        res.status(200).json(result);
      })
  })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(error);
      return next(error);
    });
};

// this should be available only for admin 

exports.postEditUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    const err = new Error(errors.array()[0].msg);
    err.statusCode = 422;
    throw err;
  }

  const id = req.params.id;
  if (req.userId != id) {
    console.log("Pokušavate urediti tuđi profil!");
    const err = new Error("Niste autorizirani!");
    err.statusCode = 401;
    throw err;
  }

  const updatedEmail = req.body.email;
  const updatedPassword = req.body.password;
  const updatedIsAdmin = req.body.isAdmin;
  const updatedName = req.body.name;
  const updatedSurname = req.body.surname;
  const updatedPhoneNumber = req.body.phoneNumber;
  const updatedPicture = req.body.picture;
  const updatedFacultyId = req.body.facultyId;
  const updatedCityId = req.body.cityId;

  let updatedUser;

  User.findByPk(id)
    .then(result => {
      if (Object.keys(result).length == 0) {
        res.status(404).json("Ne postoji titula s odabranim ID-jem");
        return;
      }
      updatedUser = result;
      return result;
    })
    .then(result => {
      return bcrypt.hash(updatedPassword, 12)
    }) // TODO: chech what is recommanded value for salt
    .then(hashedPassword => {
      return hashedPassword;
    })
    .then(hashedPassword => {
      updatedUser.email = updatedEmail;
      updatedUser.password = hashedPassword;
      updatedUser.name = updatedName;
      updatedUser.surname = updatedSurname;
      updatedUser.isAdmin = updatedIsAdmin;
      updatedUser.phoneNumber = updatedPhoneNumber;
      updatedUser.picture = updatedPicture;
      updatedUser.facultyId = updatedFacultyId;
      updatedUser.cityId = updatedCityId;

      return updatedUser.save();
    })
    .then(result => {
      console.log("Korisnik je ažuriran!");
      res.status(200).json(result);
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(err);
      return next(error);
    });
};

exports.deleteUser = (req, res, next) => {
  const id = req.userId // we can change this to req.body.userId if we also want admin to delete users.
  let loadedUser;

  User.findByPk(id)
    .then(result => {
      if (!result) {
        res.status(404).json("Ne postoji korisnik s navedenim ID-jem");
        return;
      }
      loadedUser = result;
      return loadedUser.getReservation();
    })
    .then(reservations => {
      if (reservations) {
        console.log("brišem rezervacije ovog korisnika...");
        reservations.destroy();
      }
      loadedUser.destroy();
      console.log("Obrisan korisnik i sve njegove rezervacije!");
      res.status(200).json("Uspješno obrisan korisnik i sve njegove rezervacije!");
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(error);
      return next(error);
    })
};