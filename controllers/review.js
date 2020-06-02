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
    const userId = req.userId;
    Review.findOne( {where: { instructorId: id, userId : userId }}).then(result => {
      if(!result || Object.keys(result).length == 0){
        console.log("Ne postoji ocjena ovog korisnika za tog instruktora");
        res.status(200).json({status:0, mark:null});
        return;
      }
      console.log(`Evo ocjene ovog korisnika za instruktora s tim ID-jem`);
      res.status(200).json({status:1, mark:result.reviewMark});
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.postAddReview = (req, res, next) => { 
  const id = req.params.id;
  const userId = req.userId;
  const reviewMark = req.body.mark;
  Review.create({
    instructorId: id,
    userId: userId,
    reviewMark: reviewMark
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
  const instructorId = req.params.id;
  const userId = req.userId;
  const updatedMark = req.body.mark;
  Review.findOne({where: {instructorId: instructorId, userId: userId}})
    .then(result => {
      if(!result) {
        res.status(404).json("Ne postoji ocjena ovog korisnika za instruktora s odabranim ID-jem");
        return;
      }
      result.reviewMark = updatedMark;
      return result.save();
    })
    .then(result => {
      console.log("Ocjena ovog korisnika za ovog instruktora je ažurirana!");
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