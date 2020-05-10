const { validationResult } = require('express-validator');

const Course = require('../models/course');
const User = require('../models/user');
const Instructor = require('../models/instructor');
const Faculty = require('../models/faculty');

exports.getAllInstructors = (req, res, next) => { 
    Instructor.findAll({ 
      include: [ 
        { 
          model: User,  
        }, 
        { 
          model: Course,  
        } 
      ]})
      .then(result => {
        if(Object.keys(result).length == 0){
          res.status(204).json("Ne postoji nijedan instruktor!");
          console.log("Ne postoji nijedan instruktor.");
        }
        res.status(200).json(result);
        console.log("Uspješno prikupljen popis instruktora!");
      })
      .catch(err => {
        const error = new Error(err);
        error.statusCode = 500;
        console.log(error);
        return next(error);
      });
};

exports.getInstructorById = (req, res, next) => { 
    const id = req.params.id;
    Instructor.findByPk(id, { 
      include: [ 
        { 
          model: User, 
        }, 
        { 
          model: Course,
        } 
      ]
      })
      .then(result => {
        if(!result){
          console.log("Ne postoji instruktor s ID-jem " + id);
          res.status(404).json("Ne postoji instruktor s ID-jem " + id);
          return;
        }
        console.log("Instruktor je ");
        res.status(200).json(result);
      })
      .catch(err => {
        const error = new Error(err);
        error.statusCode = 500;
        console.log(error);
        return next(error);
      });
};



exports.postAddInstructor = (req, res, next) => { 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    const err = new Error(errors.array()[0].msg);
    err.statusCode = 422;
    throw err;
  }

  const userId = req.userId;
  let loadedUser;
  if(req.userId != userId){
    console.log("Pokušavate dodati instruktora za tuđi profil!");
    const err = new Error("Niste autorizirani!");
    err.statusCode = 401;
    throw err;
  }

  User.findByPk(userId)
  .then(user => {
    if(!user) {
      res.status(404).json("Ne postoji korisnik s navedenim ID-jem");
      return;
    }
    loadedUser = user;
    return Instructor.findOne( { where: { userId: userId } } );
  })
  .then( instructor => {
    if(instructor){
      const err = new Error("Ovaj korisnik je već instruktor!");
      err.statusCode = 422;
      throw err;
    }
    
    const address = req.body.address;
    const description = req.body.description;
    const degreeId = req.body.degreeId;

    return loadedUser.createInstructor({
            address: address,
            description: description,
            degreeId: degreeId
            });

  })
  .then(result => {
    res.status(201).json("Dodan novi instruktor!");
    console.log(`Novi instruktor uspješno dodan!`);
  })
  .catch(err => {
    const error = new Error(err);
    error.statusCode = 500;
    console.log(error);
    return next(error);
  });
};

exports.postEditInstructor = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    const err = new Error(errors.array()[0].msg);
    err.statusCode = 422;
    throw err;
  }

  const userId = req.userId;
  if(req.userId != userId){
    console.log("Pokušavate dodati instruktora za tuđi profil!");
    const err = new Error("Niste autorizirani!");
    err.statusCode = 401;
    throw err;
  }
  const id = req.params.id;
  const updatedAddress = req.body.address;
  const updatedDescription = req.body.description;
  const updatedDegreeId = req.body.degreeId;
  
  Instructor.findByPk(id)
    .then(result => {
      if(Object.keys(result).length == 0) {
        res.status(404).json("Ne postoji instruktor s odabranim ID-jem");
        return;
      }
      result.address = updatedAddress;
      result.description = updatedDescription;
      result.degreeId = updatedDegreeId;
      return result.save();
    })
    .then(result => {
      console.log("Instruktor je ažuriran!");
      res.status(200).json(result);
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(error);
      return next(error);
    })
};

exports.deleteInstructor = (req, res, next) => {
  const id = req.userId;
  let loadedInstructor; 

  User.findByPk(id)
    .then(result => {
      if(!result) {
        res.status(404).json("Ne postoji korisnik s navedenim ID-jem");
        return;
      }
      return result.getInstructor();
    })
    .then(instructor => {
      if(!instructor) {
        const err = new Error("Ovaj korisnik nije instruktor!");
        err.statusCode = 404;
        throw err;
      }
      loadedInstructor = instructor;
      return instructor.getReviews();
     })
     .then(reviews => {
       console.log(reviews);
       if(reviews){
         console.log(reviews);
         reviews.forEach(element => {
           element.destroy();
         });
       }
     })
    .then(result => {
       return loadedInstructor.destroy();
    })
    .then(result => {
      res.status(200).json("Instruktor, predmeti, ocjene i termini su uspješno obrisani!");
    })
    .catch(err => {
      const error = new Error(err);
      error.statusCode = 500;
      console.log(error);
      return next(error);
    })
};