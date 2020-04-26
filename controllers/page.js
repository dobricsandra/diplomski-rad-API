const sqlConfig = require('../config/database.js');
const db = require('mssql');

// GET all existing instructors
exports.getAllInstructors = (req, res, next) => {
    db.connect(sqlConfig)
        .then(() => {
            new db.Request().query("SELECT * FROM [user]", (err, data) => {
                if (err) {
                    console.log(err);
                }
                res.status(200).json(data);
                db.close();
            })
    }).catch(err => console.log(err));
};

// // GET instructor by ID 
exports.getInstructorById = (req, res, next) => {
    const id = req.params.id;
    db.connect(sqlConfig)
        .then(() => {
            new db.Request().query(`SELECT * FROM [user] WHERE id = ${id}`, (err, data) => {
                if (err) {
                    console.log(err);
                }
                if (Object.keys(data).length){
                    res.status(400).json("Ne postoji taj korisnik!");
                }
                res.status(200).json(data);
                db.close();
            })
    }).catch(err => console.log(err));
};

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