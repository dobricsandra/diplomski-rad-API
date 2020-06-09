const Course = require('../models/course');
const User = require('../models/faculty');
const Instructor = require('../models/instructor');
const Faculty = require('../models/faculty');
const InstructorCourse = require('../models/instructor_course');

exports.getAllCourses = (req, res, next) => { 
    Course.findAll({ include: [{model: Faculty}]}).then(result => {
      if(Object.keys(result).length == 0){
        res.status(204).json("Ne postoji nijedan predmet!");
        console.log("Ne postoji nijedan predmet.");
      }
      res.status(200).json(result);
      console.log(`Evo svi predmeti`);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.getCourseById = (req, res, next) => { 
    const id = req.params.id;
    Course.findByPk(id).then(result => {
      if(result == null){
        console.log("Ne postoji takav predmet");
        res.status(404).json("Ne postoji predmet s tim ID-jem");
        return;
      }
      console.log(`Evo predmeti po ID-u`);
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.addCoursesToInstructor = (req, res, next) => { 
    const userId = req.userId;
    console.log("iz addcourse" +req.userId);
    const courseId = req.body.courseId;
    const price = req.body.price;
    let instructor;
    Instructor.findOne({  
      where: {
        userId: userId
      }
    }).then(result => {
        console.log(result);
    
      instructor=result;
      Course.findByPk(courseId).then(course => {
          console.log(course);
          instructor.addCourse(course,{ through: {price:price}}).then(result =>  {
              console.log("Dodan course instruktoru!");
              res.status(200).json(result);
            })
          .catch(err => console.log(err))
          
      })
      .catch(err => console.log(err));
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
  };

exports.getAllInstructorsForCourse = (req, res, next) => {
  id = req.params.id;
  Course.findAll({
    where: {
      id: id
    },
    include: [{
      model: Instructor
    }]
  }).then(result => {
    if(Object.keys(result).length == 0) {
      res.status(404).json("Ne postoji predmet s odabranim ID-jem");
      return;
    }
    res.status(200).json(result);
    console.log("Popis instruktora za navedeni predmet:")
  }).catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  })
};


exports.getAllCoursesForInstructor = (req, res, next) => {
  userId = req.userId;
  Instructor.findOne({
    where: {
      userId: userId
    },
    include: [{
      model: Course, include: [
        {model:Faculty}
      ]
    }]
  }).then(result => {
    if(Object.keys(result).length == 0) {
      res.status(204).json("Ne postoji nijedan predmet za instruktora s odabranim ID-jem");
      return;
    }
    res.status(200).json(result);
    console.log("Popis predmeta za navedenog instruktora:")
  }).catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  })
};
// this should be available only for admin 

exports.postAddCourse = (req, res, next) => { 
  const name = req.body.name;
  const abbreviation = req.body.abbreviation;
  const facultyId =  req.body.facultyId;
  Course.create({
    name: name,
    abbreviation: abbreviation,
    facultyId: facultyId
   })
  .then(result => {
    res.status(201).json(result);
    console.log(`Novi predmet uspješno dodan!`);
  })
  .catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  });
};

exports.postEditCourse = (req, res, next) => {
  const id = req.params.id;
  const updatedName = req.body.name;
  const updatedAbbreviation = req.body.abbreviation;
  const updatedFacultyId =  req.body.facultyId;
  Course.findByPk(id)
    .then(result => {
      if(Object.keys(result).length == 0) {
        res.status(404).json("Ne postoji predmet s odabranim ID-jem");
        return;
      }
      result.name = updatedName;
      result.abbreviation = updatedAbbreviation;
      result.facultyId = updatedFacultyId;
      return result.save();
    })
    .then(result => {
      console.log("Predmet je ažuriran!");
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    })
};

exports.deleteCourse = (req, res, next) => {
  const id = req.body.id;
  Course.findByPk(id)
    .then(result => {
      return result.destroy();
    })
    .then(result =>{
      console.log("Obrisan predmet!");
      res.status(200).json("Uspješno obrisan predmet!");
    })
    .catch(err => {
      console.log("Neuspješno brisanje!");
      res.status(404).json("Neuspješno brisanje!");
    })
};