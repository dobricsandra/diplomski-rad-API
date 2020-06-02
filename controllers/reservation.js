const Reservation = require('../models/reservation');
const Term = require('../models/term');
const User = require('../models/user');
const Instructor = require('../models/instructor');
const Course = require('../models/course');
const InstructorCourse = require('../models/instructor_course');
const Faculty = require('../models/faculty');

// exports.getAllReviewsForInstructor = (req, res, next) => { 
//     const id = req.params.id;
//     Review.findAll( {where: { 'instructor_id' : id }}).then(result => {
//       if(Object.keys(result) == 0){
//         console.log("Ne postoji ocjena za instruktora");
//         res.status(404).json("Ne postoji ocjena za instruktora s tim ID-jem");
//         return;
//       }
//       console.log(`Evo ocjene za instruktora s tim ID-jem`);
//       res.status(200).json(result);
//     })
//     .catch(err => {
//       res.status(500).json("Nešto je pošlo po zlu!");
//       console.log(err);
//     });
// };

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

exports.postAddReservation = (req, res, next) => {
    const userId = req.userId;
    const comment = req.body.comment;
    const courseId = req.body.courseId;
    Reservation.create({
        userId: userId,
        comment: comment,
        courseId: courseId,
        isCancelledByUser: null
    })
        .then(result => {
            res.status(201).json(result);
            console.log(`Nova rezervacija uspješno dodana!`);
        })
        .catch(err => {
            const error = new Error(err);
            error.statusCode = 500;
            console.log(error);
            return next(error);
        });
};


exports.getReservationsForCurrentUser = (req, res, next) => {
    const userId = req.userId;

    Reservation.findAll({
        where: { userId: userId },
        include: [
            {
                model: Term, order: ['startTime'], include: [
                    {
                        model: Instructor, include: [
                             { model: User } 
                        ]
                    }
                ]
            },
            {
                model: Course, include: [{ model: Faculty }]
            }]
    })
        .then(result => {
            if (Object.keys(result).length == 0) {
                res.status(404).json("Ne postoji trazeni termin!");
                return;
            }
            console.log("Rezervacije za trenutno ulogiranog korisnika vremenski poredane");
            res.status(200).json(result);
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 500;
            console.log(error);
            return next(error);
        })
}


exports.postReserveTerm = (req, res, next) => {
    const instructorId = req.params.id;
    const startTime = req.body.startTime;
    const reservationId = req.body.reservationId;

    Term.findOne({ where: { startTime: startTime, instructorId: instructorId } })
        .then(result => {
            if (Object.keys(result).length == 0) {
                res.status(404).json("Ne postoji trazeni termin!");
                return;
            }
            result.reservationId = reservationId;
            return result.save();
        })
        .then(result => {
            console.log("Reervacija pridruena terminu!");
            res.status(200).json(result);
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 500;
            console.log(error);
            return next(error);
        })
}

exports.cancelReservationByInstructor = (req, res, next) => {
    const reservationId = req.params.id;
    const instructorId = req.body.instructorId;
    const term = req.body.term;
    console.log(term);

    Reservation.findOne({ where: { id: reservationId} })
        .then(result => {
            if (Object.keys(result).length == 0) {
                res.status(404).json("Ne postoji trazeni termin!");
                return;
            }
            result.isCancelledByInstructor = instructorId;
            result.cancelledTerm = term;
            return result.save();
        })
        .then(result => {
            return Term.findOne( {where: {reservationId: reservationId}})
        })
        .then(result => {
            return result.destroy();
        })
        .then(result => { 
            console.log("Reervaciju otkazao instruktor!");
            res.status(200).json(result);}
        )
        .catch(err => {
            const error = new Error(err);
            error.status = 500;
            console.log(error);
            return next(error);
        })
}

exports.getReservationIdForTerm = (req, res, next) => {
    const startTime = req.params.startTime;

    Term.findOne({where: {startTime: startTime}})
        .then(result => {
            if (Object.keys(result).length == 0) {
                res.status(404).json("Ne postoji rezervacija!");
                return;
            }
            console.log("Podaci o terminu");
            res.status(200).json(result);
        })
        .then(result => {
            
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 500;
            console.log(error);
            return next(error);
        })
}

exports.getReservationDetails = (req, res, next) => {
    const reservationId = req.params.id;

    Reservation.findOne({where: {id: reservationId}, include: [{model: User}, {model: Course, include: [{model:Faculty}]}]})
        .then(result => {
            if (Object.keys(result).length == 0) {
                res.status(404).json("Ne postoji rezervacija!");
                return;
            }
            console.log("Detalji o rezervaciji!");
            res.status(200).json(result);
        })
        .then(result => {
            
        })
        .catch(err => {
            const error = new Error(err);
            error.status = 500;
            console.log(error);
            return next(error);
        })
}
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