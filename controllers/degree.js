const Degree = require('../models/degree');

exports.getAllDegrees = (req, res, next) => { 
    Degrees.findAll().then(result => {
      if(Object.keys(result).length == 0){
        res.status(204).json("Ne postoji nijedan stupanj obrazovanja!");
        console.log("Ne postoji nijedan stupanj obrazovanja.");
      }
      res.status(200).json(result);
      console.log(`Evo svi stupnjevi obrazovanja`);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.getDegreeById = (req, res, next) => { 
    const id = req.params.id;
    Degree.findByPk(id).then(result => {
      if(result == null){
        console.log("Ne postoji takav stupanj obrazovanja");
        res.status(404).json("Ne postoji stupanj obrazovanja s tim ID-jem");
        return;
      }
      console.log(`Evo stupnjevi obrazovanja po ID-u`);
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

// this should be available only for admin 

exports.postAddDegree = (req, res, next) => { 
  const name = req.body.name;
  const abbreviation = req.body.abbreviation;
  Degree.create({
    name: name,
    abbreviation: abbreviation
   })
  .then(result => {
    res.status(201).json("Dodan novi stupanj obrazovanja!");
    console.log(`Novi stupanj obrazovanja uspješno dodan!`);
  })
  .catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  });
};

exports.postEditDegree = (req, res, next) => {
  const id = req.params.id;
  const updatedName = req.body.name;
  const updatedAbbreviation = req.body.abbreviation;
  Degree.findByPk(id)
    .then(result => {
      if(Object.keys(result).length == 0) {
        res.status(404).json("Ne postoji stupanj obrazovanja s odabranim ID-jem");
        return;
      }
      name = updatedName;
      abbreviation = updatedAbbreviation;
      return result.save();
    })
    .then(result => {
      console.log("Stupanj obrazovanja je ažuriran!");
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    })
};

exports.deleteDegree = (req, res, next) => {
  const id = req.body.id;
  Degree.findByPk(id)
    .then(result => {
      return result.destroy();
    })
    .then(result =>{
      console.log("Obrisan stupanj obrazovanja!");
      res.status(200).json("Uspješno obrisan stupanj obrazovanja!");
    })
    .catch(err => {
      console.log("Neuspješno brisanje!");
      res.status(404).json("Neuspješno brisanje!");
    })
};