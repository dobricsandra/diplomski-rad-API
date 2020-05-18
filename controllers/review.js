const Review = require('../models/review');
const Instructor = require('../models/instructor');

exports.getAllReviewsForInstructor = (req, res, next) => { 
    const id = req.params.id;
    Review.findAll( {where: { 'instructor_id' : id }}).then(result => {
      if(Object.keys(result) == 0){
        console.log("Ne postoji ocjena za instruktora");
        res.status(404).json("Ne postoji ocjena za instruktora s tim ID-jem");
        return;
      }
      console.log(`Evo ocjene za instruktora s tim ID-jem`);
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.getReviewFromUserToInstructor = (req, res, next) => { 
    const id = req.params.id;
    const userId = req.body.userId;
    Review.findAll( {where: { 'instructor_id' : id, 'user_id' : userId }}).then(result => {
      if(result == null){
        console.log("Ne postoji ocjena ovog korisnika za tog instruktora");
        res.status(404).json("Ne postoji ocjena ovog korisnika za instruktora s tim ID-jem");
        return;
      }
      console.log(`Evo ocjene ovog korisnika za instruktora s tim ID-jem`);
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.postAddReview = (req, res, next) => { 
  const id = req.params.id;
  const userId = req.body.userId;
  const mark = req.body.mark;
  Review.create({
    instructorId: id,
    userId: userId,
    mark: mark
   })
  .then(result => {
    res.status(201).json("Dodan novu ocjenu!");
    console.log(`Nova ocjena uspješno dodana!`);
  })
  .catch(err => {
    res.status(500).json("Nešto je pošlo po zlu!");
    console.log(err);
  });
};

exports.postEditReview = (req, res, next) => {
  const id = req.params.id;
  const updatedMark = req.body.mark;
  Review.findByPk(id)
    .then(result => {
      if(Object.keys(result).length == 0) {
        res.status(404).json("Ne postoji ocjena ovog korisnika za instruktora s odabranim ID-jem");
        return;
      }
      mark = updatedMark;
      abbreviation = updatedAbbreviation;
      return result.save();
    })
    .then(result => {
      console.log("Ocjena ovog instruktora je ažurirana!");
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    })
};

exports.deleteReview = (req, res, next) => {
  const id = req.body.id;
  Review.findByPk(id)
    .then(result => {
      return result.destroy();
    })
    .then(result =>{
      console.log("Obrisana ocjena!");
      res.status(200).json("Uspješno obrisana ocjena!");
    })
    .catch(err => {
      console.log("Neuspješno brisanje!");
      res.status(404).json("Neuspješno brisanje!");
    })
};