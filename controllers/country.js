const { validationResult} = require('express-validator');

const Country = require('../models/country');
const City = require('../models/city');

exports.getAllCountries = (req, res, next) => { 
    Country.findAll()
      .then(result => {
          if(Object.keys(result).length == 0){
            res.status(204).json("Ne postoji nijedna država!");
            console.log("Ne postoji nijedna država.");
          }
          res.status(200).json(result);
          console.log("Države pronađene!");
      })
      .catch(err => {
          const error = new Error(err);
          error.statusCode = 500;
          console.log(error);
          return next(error);
      });
};

exports.getCountryById = (req, res, next) => { 
    const id = req.params.id;
    Country.findByPk(id).then(result => {
      if(result == null){
        console.log("Ne postoji takva država");
        res.status(404).json("Ne postoji država s tim ID-jem");
        return;
      }
      console.log("Država s ID-jem " + id + "je " + result.name);
      res.status(200).json(result);
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(error);
      return next(error);
    });  
};

exports.getAllCitiesInCountry = (req, res, next) => {
  id = req.params.id;
  City.findAll({
    where: {
      countryId: id
    }
  })
  .then(result => {
    if(Object.keys(result).length == 0) {
      res.status(404).json("Ne postoji nijedan grad u državi s ID-jem " + id);
      return;
    }
    res.status(200).json(result);
    console.log("Pronađeni svi gradovi za navedenu državu:");
  })
  .catch(err => {
    const error = new Error(err);
    error.statusCode = 500;
    console.log(error);
    return next(error);
  })
};


// only for admin

exports.postAddCountry = (req, res, next) => { 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    const err = new Error(errors.array()[0].msg);
    err.statusCode = 422;
    throw err;
  }

  const name = req.body.name;
  const abbreviation = req.body.abbreviation;
  const currency =  req.body.currency;

  Country.create({
  name: name,
  abbreviation: abbreviation,
  currency: currency
  })
  .then(result => {
    res.status(201).json("Dodana nova država!");
    console.log("Nova država uspješno dodana: " + result.id);
  })
  .catch(err => {
    const error = new Error(err);
    error.statusCode = 500;
    console.log(error);
    return next(error);
  });
};

exports.postEditCountry = (req, res, next) => {
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
  const updatedCurrency =  req.body.currency;

  Country.findByPk(id)
    .then(result => {
      if(Object.keys(result).length == 0) {
        res.status(404).json("Ne postoji država s odabranim ID-jem");
        return;
      }
      result.name = updatedName;
      result.abbreviation = updatedAbbreviation;
      result.currency = updatedCurrency;
      return result.save();
    })
    .then(result => {
      console.log("Država je ažurirana!");
      res.status(200).json(result);
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(error);
      return next(error);
    })
};

exports.deleteCountry = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    const err = new Error(errors.array()[0].msg);
    err.statusCode = 422;
    throw err;
  }

  const id = req.body.id;

  Country.findByPk(id)
    .then(result => {
      if(result == null) {
        res.status(404).json("Država ne postoji!");
      }
      return result.destroy();
    })
    .then(result => {
      console.log("Obrisana država!");
      res.status(200).json("Uspješno obrisana država!");
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(error);
      return next(error);
    })
};