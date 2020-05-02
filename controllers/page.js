// const Instructor = require('../models/instructor');

// exports.postAddInstructor = (req, res, next) => {
//     Instructor.create({
//       id: 1,
//       address: 'Saljska 5',
//       description: 'ja sam instruktor',
//       userId: 1,

//     })
//       .then(result => {
//         // console.log(result);
//         console.log('Created Product');
//       })
//       .catch(err => {
//         console.log(err);
//       });
// };


// GET all existing instructors
// exports.getAllInstructors = (req, res, next) => {
//     Product.
//     db.connect(sqlConfig)
//         .then(() => {
//             Instructor.
//             new db.Request().query("SELECT * FROM instructor", (err, {recordset}) => {
//                 if (err) {
//                     console.log(err);
//                     res.status(500).json("Nešto je pošlo po zlu!");
//                 }
//                 else if (Object.keys(recordset).length == 0){
//                     res.status(200).json("Ne postoji nijedan korisnik u bazi!");
//                 }
//                 else{
//                     res.status(200).json(recordset);
//                 }
//                 db.close();
//             })
//         }).catch(err => {
//             console.log(err);
//             res.status(500).json("Nešto je pošlo po zlu!");
//         });
// };

// // // GET instructor by ID 
// exports.getInstructorById = (req, res, next) => {
//     const id = req.params.id;
//     db.connect(sqlConfig)
//         .then(() => {
//             new db.Request().query(`SELECT * FROM instructor WHERE id = ${id}`, (err, {recordset}) => {
//                 if (err) {
//                     console.log(err);
//                     res.status(500).json("Nešto je pošlo po zlu!");
//                 }
//                 else if (Object.keys(recordset).length == 0){
//                     res.status(400).json("Ne postoji taj korisnik!");
//                 }
//                 else{
//                     res.status(200).json(recordset);
//                 }
//                 db.close();
//             })
//     }).catch(err => {
//         console.log(err);
//         res.status(500).json("Nešto je pošlo po zlu!");
//     });
// };

// // get all instructors with rank greater than 4.0
// exports.getBestRankedInstructors = (req, res, next) => {
//     res.status(200).json({
//         instructors: [{title: 'ej', ime: 'sandra'}]
//     });
// };
// // get all instructors that have free terms today
// exports.getInstructorsAvailableToday = (req, res, next) => {
//     res.status(200).json({
//         instructors: [{title: 'ej', ime: 'sandra'}]
//     });
// };

//createNewInstructor (PUT)
//updateInstructorData (POST)
//deleteInstructor (DELETE)