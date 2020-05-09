const Course = require('../models/course');
const User = require('../models/user');
const Instructor = require('../models/instructor');
const Faculty = require('../models/faculty');

exports.getAllUsers = (req, res, next) => { 
    User.findAll().then(result => {
      if(Object.keys(result).length == 0){
        res.status(204).json("Ne postoji nijedan korisnik!");
        console.log("Ne postoji nijedan korisnik.");
      }
      res.status(200).json(result);
      console.log(`Evo svi korisnici`);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.getUserById = (req, res, next) => { 
    const id = req.params.id;
    User.findByPk(id).then(result => {
      if(result == null){
        console.log("Ne postoji takav korisnik");
        res.status(404).json("Ne postoji korisnik s tim ID-jem");
        return;
      }
      console.log(`Evo korisnici po ID-u`);
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.postGetIdByUsername = (req, res, next) => { 
  const username = req.body.username;
  User.findAll({  
    attributes: ['id'],
    where: {
      name: username
    }
  }).then(result => {
    if(Object.keys(result).length == 0){
      console.log("Ne postoji takav korisnik");
      res.status(404).json("Ne postoji korisnik s tim nazivom!");
      return;
    }
    console.log(`Evo ID korisnika s tim imenom`);
    res.status(200).json(result);
  })
  .catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  });
};

// this should be available only for admin 

exports.postAddUser = (req, res, next) => { 
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const surname = req.body.surname;
  const phoneNumber =  req.body.phoneNumber;
  const picture =  req.body.picture;
  const facultyId = req.body.facultyId;
  const cityId = req.body.cityId;
  User.create({
    email: email,
    password: password,
    isAdmin: 0,
    name: name,
    surname: surname,
    phoneNumber: phoneNumber,
    picture: picture,
    facultyId: facultyId,
    cityId: cityId
   })
  .then(result => {
    res.status(201).json("Dodan novi korisnik!");
    console.log(`Novi korisnik uspješno dodan!`);
  })
  .catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  });
};

exports.postEditUser = (req, res, next) => {
  const id = req.params.id;
  const updatedEmail = req.body.email;
  const updatedPassword = req.body.password;
  const updatedIsAdmin = req.body.isAdmin;
  const updatedName = req.body.name;
  const updatedSurname = req.body.surname;
  const updatedPhoneNumber =  req.body.phoneNumber;
  const updatedPicture =  req.body.picture;
  const updatedFacultyId = req.body.facultyId;
  const updatedCityId = req.body.cityId;
  Course.findByPk(id)
    .then(result => {
      if(Object.keys(result).length == 0) {
        res.status(404).json("Ne postoji predmet s odabranim ID-jem");
        return;
      }
      email = updatedEmail,
      password = updatedPassword,
      isAdmin =  updatedIsAdmin,
      name = updatedName,
      surname = updatedSurname,
      phoneNumber =  updatedPhoneNumber,
      picture =  updatedPicture,
      facultyId = updatedFacultyId,
      cityId = updatedCityId
      return result.save();
    })
    .then(result => {
      console.log("Korisnik je ažuriran!");
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    })
};

exports.deleteUser = (req, res, next) => {
  const id = req.body.id;
  User.findByPk(id)
    .then(result => {
      return result.destroy();
    })
    .then(result =>{
      console.log("Obrisan korisnik!");
      res.status(200).json("Uspješno obrisan korisnik!");
    })
    .catch(err => {
      console.log("Neuspješno brisanje!");
      res.status(404).json("Neuspješno brisanje!");
    })
};