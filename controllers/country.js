const { validationResult} = require('express-validator/check');

const Country = require('../models/country');
const City = require('../models/city');

exports.getAllCountries = (req, res, next) => { 
    Country.findAll().then(result => {
      if(Object.keys(result).length == 0){
        res.status(204).json("Ne postoji nijedna država!");
        console.log("Ne postoji nijedna država.");
      }
      res.status(200).json(result);
      console.log(`Evo sve države`);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.getCountryById = (req, res, next) => { 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      console.log(errors.array());
      return res.status(422).json(errors.array()[0].msg);
    }
  
    const id = req.params.id;
    Country.findByPk(id).then(result => {
      if(result == null){
        console.log("Ne postoji takva država");
        res.status(404).json("Ne postoji država s tim ID-jem");
        return;
      }
      console.log(`Evo država po ID-u`);
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });  
};

exports.postGetIdByCountryName = (req, res, next) => { 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).json(errors.array()[0].msg);
  }

  const countryName = req.body.countryName;
  Country.findAll({  
    attributes: ['id'],
    where: {
      name: countryName
    }
  }).then(result => {
    if(Object.keys(result).length == 0){
      console.log("Ne postoji takva država");
      res.status(404).json("Ne postoji država s tim nazivom!");
      return;
    }
    console.log(`Evo ID države s tim imenom`);
    res.status(200).json(result);
  })
  .catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  });
};

exports.getAllCitiesInCountry = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).json(errors.array()[0].msg);
  }

  id = req.params.id;
  Country.findAll({
    where: {
      id: id
    },
    include: [{
      model: City
    }]
  }).then(result => {
    if(Object.keys(result).length == 0) {
      res.status(404).json("Ne postoji država s odabranim ID-jem");
      return;
    }
    res.status(200).json(result);
    console.log("Popis gradova za navedenu državu:")
  }).catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  })
};




// this should be available only for admin to do

exports.postAddCountry = (req, res, next) => { 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).json(errors.array()[0].msg);
  }
  const name = req.body.name;
  const abbreviation = req.body.abbreviation;
  const currency =  req.body.currency;
  Country.create({
  name: name,
  abbreviation: abbreviation,
  currency: currency
}).then(result => {
    res.status(201).json("Dodana nova država!");
    console.log(`Nova država uspješno dodana!`);
  })
  .catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  });
};

exports.postEditCountry = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).json(errors.array()[0].msg);
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
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    })
};

exports.deleteCountry = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).json(errors.array()[0].msg);
  }
  const id = req.body.id;
  Country.findByPk(id)
    .then(result => {
      return result.destroy();
    })
    .then(result =>{
      console.log("Obrisana država!");
      res.status(200).json("Uspješno obrisana država!");
    })
    .catch(err => {
      console.log("Neuspješno brisanje!");
      res.status(404).json("Neuspješno brisanje!");
    })
};