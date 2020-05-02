const Country = require('../models/country');
const City = require('../models/city');
const Faculty = require('../models/faculty');
const User = require('../models/faculty');
const Instructor = require('../models/instructor');

exports.getAllCities = (req, res, next) => { 
    City.findAll().then(result => {
      if(Object.keys(result).length == 0){
        res.status(204).json("Ne postoji nijedan grad!");
        console.log("Ne postoji nijedan grad.");
      }
      res.status(200).json(result);
      console.log(`Evo svi gradovi`);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.getCityById = (req, res, next) => { 
    const id = req.params.id;
    City.findByPk(id).then(result => {
      if(result == null){
        console.log("Ne postoji takav grad");
        res.status(404).json("Ne postoji grad s tim ID-jem");
        return;
      }
      console.log(`Evo gradovi po ID-u`);
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.postGetIdByCityName = (req, res, next) => { 
  const cityName = req.body.cityName;
  City.findAll({  
    attributes: ['id'],
    where: {
      name: cityName
    }
  }).then(result => {
    if(Object.keys(result).length == 0){
      console.log("Ne postoji takav grad");
      res.status(404).json("Ne postoji grad s tim nazivom!");
      return;
    }
    console.log(`Evo ID grada s tim imenom`);
    res.status(200).json(result);
  })
  .catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  });
};

exports.getAllFacultiesInCity = (req, res, next) => {
  id = req.params.id;
  City.findAll({
    where: {
      id: id
    },
    include: [{
      model: Faculty
    }]
  }).then(result => {
    if(Object.keys(result).length == 0) {
      res.status(404).json("Ne postoji grad s odabranim ID-jem");
      return;
    }
    res.status(200).json(result);
    console.log("Popis fakulteta za navedeni grad:")
  }).catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  })
};


// exports.getAllInstructorsInCity = (req, res, next) => {
//   id = req.params.id;
//   City.findAll({
//     where: {
//       id: id
//     },
//     include: [
//       { model: User },
//       { model: Instructor,
//         through: {attributes: ['user_id']}, 
//       }
//     ]
//   }).then(result => {
//     if(Object.keys(result).length == 0) {
//       res.status(404).json("Ne postoji grad s odabranim ID-jem");
//       return;
//     }
//     res.status(200).json(result);
//     console.log("Popis instruktora za navedeni grad:")
//   }).catch(err => {
//     res.status(500).json("Nešto je pošlo po zlu!");
//     console.log(err);
//   })
// };


// this should be available only for admin 

exports.postAddCity = (req, res, next) => { 
  const postalCode = req.body.postalCode;
  const name = req.body.name;
  const abbreviation = req.body.abbreviation;
  const countryId =  req.body.countryId;
  City.create({
    postalCode: postalCode,
    name: name,
    abbreviation: abbreviation,
    countryId: countryId
   })
  .then(result => {
    res.status(201).json("Dodan novi grad!");
    console.log(`Novi grad uspješno dodan!`);
  })
  .catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  });
};

exports.postEditCity = (req, res, next) => {
  const id = req.params.id;
  const updatedPostalCode = req.body.postalCode;
  const updatedName = req.body.name;
  const updatedAbbreviation = req.body.abbreviation;
  const updatedCountryId =  req.body.countryId;
  City.findByPk(id)
    .then(result => {
      if(Object.keys(result).length == 0) {
        res.status(404).json("Ne postoji grad s odabranim ID-jem");
        return;
      }
      result.postalCode = updatedPostalCode;
      result.name = updatedName;
      result.abbreviation = updatedAbbreviation;
      result.countryId = updatedCountryId;
      return result.save();
    })
    .then(result => {
      console.log("Grad je ažuriran!");
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    })
};

exports.deleteCity = (req, res, next) => {
  const id = req.body.id;
  City.findByPk(id)
    .then(result => {
      return result.destroy();
    })
    .then(result =>{
      console.log("Obrisan grad!");
      res.status(200).json("Uspješno obrisan grad!");
    })
    .catch(err => {
      console.log("Neuspješno brisanje!");
      res.status(404).json("Neuspješno brisanje!");
    })
};