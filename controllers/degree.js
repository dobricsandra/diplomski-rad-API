const { validationResult } = require('express-validator');

const Degree = require('../models/degree');

exports.getAllDegrees = (req, res, next) => { 
    Degree.findAll().then(result => {
      if(Object.keys(result).length == 0 || result == null){
        res.status(204).json("Ne postoji nijedna titula!");
        console.log("Ne postoji nijedna titula.");
      }
      res.status(200).json(result);
      console.log("Uspješno prikupljene titule.");
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(error);
      return next(error);
    });
};

exports.getDegreeById = (req, res, next) => { 
    const id = req.params.id;
    Degree.findByPk(id).then(result => {
      if(result == null){
        console.log("Ne postoji titula ID-jem " + result.name);
        res.status(404).json("Ne postoji titula ID-jem " + result.name);
        return;
      }
      console.log("Uspješno prikupljene titule.");
      res.status(200).json(result);
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(error);
      return next(error);
    });
};

// this should be available only for admin 

exports.postAddDegree = (req, res, next) => { 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    const err = new Error(errors.array()[0].msg);
    err.statusCode = 422;
    throw err;
  }

  const name = req.body.name;
  const abbreviation = req.body.abbreviation;
  Degree.create({
    name: name,
    abbreviation: abbreviation
   })
  .then(result => {
    res.status(201).json("Dodana nova titula " + result.name);
    console.log("Dodana nova titula " + result.name);
  })
  .catch(err => {
    const error = new Error(err);
    error.statusCode = 500;
    console.log(error);
    return next(error);
  });
};

exports.postEditDegree = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    const err = new Error(errors.array()[0].msg);
    err.statusCode = 422;
    throw err;
  }

  const id = req.params.id;
  const updatedName = req.body.name;
  const updatedAbbreviation = req.body.abbreviation;
  Degree.findByPk(id)
    .then(result => {
      if(Object.keys(result).length == 0) {
        res.status(404).json("Ne postoji titula s odabranim ID-jem");
        return;
      }
      result.name = updatedName;
      result.abbreviation = updatedAbbreviation;
      return result.save();
    })
    .then(result => {
      console.log("Stupanj obrazovanja je ažuriran!");
      res.status(200).json(result);
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(error);
      return next(error);
    })
};

exports.deleteDegree = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    const err = new Error(errors.array()[0].msg);
    err.statusCode = 422;
    throw err;
  }

  const id = req.body.id;
  Degree.findByPk(id)
    .then(result => {
      if(result == null) {
        res.status(404).json("Titula ne postoji!");
      }
      return result.destroy();
    })
    .then(result =>{
      console.log("Obrisan stupanj obrazovanja!");
      res.status(200).json("Uspješno obrisan stupanj obrazovanja!");
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(error);
      return next(error);
    })
};