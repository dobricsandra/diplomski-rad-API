const City = require('../models/city');
const Faculty = require('../models/faculty');
const User = require('../models/faculty');
const Instructor = require('../models/instructor');
const Course = require('../models/course');


exports.getAllFaculties = (req, res, next) => { 
    Faculty.findAll().then(result => {
      if(Object.keys(result).length == 0){
        res.status(204).json("Ne postoji nijedan fakultet!");
        console.log("Ne postoji nijedan fakultet.");
      }
      res.status(200).json(result);
      console.log(`Evo svi fakulteti`);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.getFacultyById = (req, res, next) => { 
    const id = req.params.id;
    Faculty.findByPk(id).then(result => {
      if(result == null){
        console.log("Ne postoji takav fakultet");
        res.status(404).json("Ne postoji fakultet s tim ID-jem");
        return;
      }
      console.log(`Evo fakulteti po ID-u`);
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.getAllInstructorsOnFaculty = (req, res, next) => {
  id = req.params.id;
  Faculty.findAll({
    where: {
      id: id
    },
    include: [{
      model: User
    }]
  }).then(result => {
    if(Object.keys(result).length == 0) {
      res.status(404).json("Ne postoji fakultet s odabranim ID-jem");
      return;
    }
    res.status(200).json(result);
    console.log("Popis korisnika za navedeni fakultet:")
  }).catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  })
};


  exports.getAllCoursesOnFaculty = (req, res, next) => {
    facultyId = req.params.id;
    Course.findAll({   
      where: {
        facultyId: facultyId
      }
    }).then(result => {
      if(Object.keys(result).length == 0) {
        res.status(404).json("Ne postoji fakultet s odabranim ID-jem");
        return;
      }
      res.status(200).json(result);
      console.log("Popis predmeta za navedeni fakultet:")
    }).catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    })
  };

// this should be available only for admin 

exports.postAddFaculty = (req, res, next) => { 

  const name = req.body.name;
  const abbreviation = req.body.abbreviation;
  const cityId =  parseInt(req.body.cityId);
  console.log(cityId);
  let city;
  City.findByPk(cityId).then(result => {
    if(result == null){
      console.log("Ne postoji odabran grad");
      res.status(404).json("Ne postoji grad s tim ID-jem");
      return;
    }
    console.log(`Evo gradovi po ID-u`);
    city = result;
    console.log(city);
    city.createFaculty({
        name: name,
        abbreviation: abbreviation,
       })
      .then(result => {
        res.status(201).json(result);
        console.log(`Novi fakultet uspješno dodan!`);
      })
      .catch(err => {
        res.status(500).json("Nešto je pošlo po zlu!");
        console.log(err);
      });
    
  })
  .catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  });
 
};

exports.postEditFaculty = (req, res, next) => {
  const id = req.params.id;
  const updatedName = req.body.name;
  const updatedAbbreviation = req.body.abbreviation;
  const updatedCityId =  req.body.cityId;
  Faculty.findByPk(id)
    .then(result => {
      if(Object.keys(result).length == 0) {
        res.status(404).json("Ne postoji fakultet s odabranim ID-jem");
        return;
      }
      result.name = updatedName;
      result.abbreviation = updatedAbbreviation;
      result.cityId = updatedCityId;
      return result.save();
    })
    .then(result => {
      console.log("Fakultet je ažuriran!");
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    })
};

exports.deleteFaculty = (req, res, next) => {
  const id = req.body.id;
  Faculty.findByPk(id)
    .then(result => {
      console.log(result);
      return result.destroy();
    })
    .then(result =>{
      console.log("Obrisan fakultet!");
      res.status(200).json("Uspješno obrisan fakultet!");
    })
    .catch(err => {
      console.log("Neuspješno brisanje!");
      console.log(err);
      res.status(404).json("Neuspješno brisanje!");
    })
};

