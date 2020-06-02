const Term = require('../models/term');
const User = require('../models/user');

exports.getAllTermsForInstructor = (req, res, next) => { 
    const id = req.params.id;
    Term.findAll( {where: { instructorId : id }}).then(result => {
      if(Object.keys(result) == 0){
        console.log("Ne postoji nijedan termin za instruktora");
        res.status(404).json("Ne postoji termin za instruktora s tim ID-jem");
        return;
      }
      console.log(`Evo termini za instruktora s tim ID-jem`);
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.getIsTermReserved = (req, res, next) => { 
    const startTime = req.params.id;
    Term.findOne({where: {startTime: startTime}}).then(result => {
      if(Object.keys(result) == 0){
        console.log("Ne postoji trazeni termin");
        res.status(404).json("Ne postoji trazeni termin");
        return;
      }
      if(result.reservationId == null){
          console.log("termin je slobodan");
          return res.status(200).json({isReserved: false});
      }
      if(result.reservationId != null) {
          console.log("termin je rezerviran");
          return res.status(200).json({isReserved: true});
      }
    })
    .catch(err => {
      res.status(500).json("Nešto je pošlo po zlu!");
      console.log(err);
    });
};

exports.setNewTerm = (req, res, next) => { 
    const instructorId = parseInt(req.body.instructorId);
    const startTime = req.body.startTime;

      Term.create({
        instructorId: instructorId,
        startTime: startTime,
        reservationId: null
         })
        .then(result => {
          res.status(201).json(result);
          console.log(`Novi termin uspješno dodan!`);
        })
        .catch(err => {
          res.status(500).json("Nešto je pošlo po zlu!");
          console.log(err);
        });  
};

exports.deleteExistingTerm = (req, res, next) => { 
    const instructorId = parseInt(req.body.instructorId);
    const startTime = req.body.startTime;

      Term.findOne({where: {instructorId: instructorId, startTime: startTime}})
        .then(result => {
          return result.destroy();
        })
        .then(result => {
          res.status(201).json(result);
          console.log(`Termin uspješno izbrisan!`);
        })
        .catch(err => {
          res.status(500).json("Nešto je pošlo po zlu!");
          console.log(err);
        });  
};
// exports.getReviewFromUserToInstructor = (req, res, next) => { 
//     const id = req.params.id;
//     const userId = req.body.userId;
//     Review.findAll( {where: { 'instructor_id' : id, 'user_id' : userId }}).then(result => {
//       if(result == null){
//         console.log("Ne postoji ocjena ovog korisnika za tog instruktora");
//         res.status(404).json("Ne postoji ocjena ovog korisnika za instruktora s tim ID-jem");
//         return;
//       }
//       console.log(`Evo ocjene ovog korisnika za instruktora s tim ID-jem`);
//       res.status(200).json(result);
//     })
//     .catch(err => {
//       res.status(500).json("Nešto je pošlo po zlu!");
//       console.log(err);
//     });
// };


// exports.postEditReview = (req, res, next) => {
//   const id = req.params.id;
//   const updatedMark = req.body.mark;
//   Review.findByPk(id)
//     .then(result => {
//       if(Object.keys(result).length == 0) {
//         res.status(404).json("Ne postoji ocjena ovog korisnika za instruktora s odabranim ID-jem");
//         return;
//       }
//       mark = updatedMark;
//       abbreviation = updatedAbbreviation;
//       return result.save();
//     })
//     .then(result => {
//       console.log("Ocjena ovog instruktora je ažurirana!");
//       res.status(200).json(result);
//     })
//     .catch(err => {
//       res.status(500).json("Nešto je pošlo po zlu!");
//       console.log(err);
//     })
// };

// exports.deleteReview = (req, res, next) => {
//   const id = req.body.id;
//   Review.findByPk(id)
//     .then(result => {
//       return result.destroy();
//     })
//     .then(result =>{
//       console.log("Obrisana ocjena!");
//       res.status(200).json("Uspješno obrisana ocjena!");
//     })
//     .catch(err => {
//       console.log("Neuspješno brisanje!");
//       res.status(404).json("Neuspješno brisanje!");
//     })
// };