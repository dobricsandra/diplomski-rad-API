const Country = require('../models/country');

exports.getAllCountries = (req, res, next) => { 
    Country.findAll().then(result => {
      res.status(200).json(result);
      console.log(`Evo sve države`);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
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
      console.log(`Evo država po ID-u`);
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.postAddCountry = (req, res, next) => { 
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