const Course = require('../models/course');
const User = require('../models/faculty');
const Instructor = require('../models/instructor');
const Faculty = require('../models/faculty');

exports.getAllInstructors = (req, res, next) => { 
    Instructor.findAll().then(result => {
      if(Object.keys(result).length == 0){
        res.status(204).json("Ne postoji nijedan instruktor!");
        console.log("Ne postoji nijedan instruktor.");
      }
      res.status(200).json(result);
      console.log(`Evo svi instruktori`);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.getInstructorById = (req, res, next) => { 
    const id = req.params.id;
    Instructor.findByPk(id).then(result => {
      if(result == null){
        console.log("Ne postoji takav instruktor");
        res.status(404).json("Ne postoji instruktor s tim ID-jem");
        return;
      }
      console.log(`Evo instruktori po ID-u`);
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

// this should be available only for admin 

exports.postAddInstructor = (req, res, next) => { 
  const address = req.body.address;
  const description = req.body.description;
  const userId = req.body.userId;
  const degreeId = req.body.degreeId;
  Instructor.create({
    address: address,
    description: description,
    userId: userId,
    degreeId: degreeId,
   })
  .then(result => {
    res.status(201).json("Dodan novi instruktor!");
    console.log(`Novi instruktor uspješno dodan!`);
  })
  .catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  });
};

exports.postEditInstructor = (req, res, next) => {
  const id = req.params.id;
  const updatedAddress = req.body.address;
  const updatedDescription = req.body.description;
  const updatedUserId = req.body.userId;
  const updatedDegreeId = req.body.degreeId;
  Instructor.findByPk(id)
    .then(result => {
      if(Object.keys(result).length == 0) {
        res.status(404).json("Ne postoji instruktor s odabranim ID-jem");
        return;
      }
      address = updatedAddress;
      description = updatedDescription;
      userId =  updatedUserId;
      degreeId = updatedDegreeId;
      return result.save();
    })
    .then(result => {
      console.log("Instruktor je ažuriran!");
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    })
};

exports.deleteInstructor = (req, res, next) => {
  const id = req.body.id;
  Instructor.findByPk(id)
    .then(result => {
      return result.destroy();
    })
    .then(result =>{
      console.log("Obrisan instruktor!");
      res.status(200).json("Uspješno obrisan instruktor!");
    })
    .catch(err => {
      console.log("Neuspješno brisanje!");
      res.status(404).json("Neuspješno brisanje!");
    })
};