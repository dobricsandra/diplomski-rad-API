const { validationResult } = require('express-validator');

const City = require('../models/city');
const Faculty = require('../models/faculty');

exports.getAllCities = (req, res, next) => { 
    City.findAll()
    .then(result => {
      if(Object.keys(result).length == 0){
        res.status(204).json("Ne postoji nijedan grad!");
        console.log("Ne postoji nijedan grad.");
      }
      console.log("Popis gradova: " + result);
      res.status(200).json(result); 
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(error);
      return next(error);
    });
};

exports.getCityById = (req, res, next) => { 
    const id = req.params.id;

    City.findByPk(id)
    .then(result => {
      if(result == null){
        console.log("Ne postoji takav grad");
        res.status(404).json("Ne postoji grad s tim ID-jem");
        return;
      }
      console.log("Grad je:" + result);
      res.status(200).json(result);
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(error);
      return next(error);
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
  })
  .then(result => {
    if(Object.keys(result).length == 0) {
      res.status(404).json("Ne postoji grad s odabranim ID-jem");
      return;
    }
    res.status(200).json(result);
    console.log("Popis fakulteta za navedeni grad:")
  })
  .catch(err => {
    const error = new Error(err);
    error.statusCode = 500;
    console.log(error);
    return next(error);;
  })
};


// this should be available only for admin 

exports.postAddCity = (req, res, next) => { 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      console.log(errors);
      const error = new Error('Postoji već grad s tim nazivom!');
      error.statusCode = 422;
      throw error;
  }

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
    const error = new Error(err);
    error.status = 500;
    console.log(error);
    return next(error);
  });
};

exports.postEditCity = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      console.log(errors);
      const error = new Error('Postoji već grad s tim nazivom!');
      error.statusCode = 422;
      throw error;
  }
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
      const error = new Error(err);
      error.status = 500;
      console.log(error);
      return next(error);
    })
};

exports.deleteCity = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      console.log(errors);
      const error = new Error('Ne možemo obrisati jer postoje korisnici u tom gradu!');
      error.statusCode = 422;
      throw error;
  }

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
      const error = new Error(err);
      error.status = 500;
      console.log(error);
      return next(error);
    })
};