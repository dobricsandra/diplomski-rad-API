'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const pageRoutes = require('./routes/page');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

const sequelize = require('./config/database');

const Degree = require('./models/degree');
const City = require('./models/city');
const Country = require('./models/country');
const Faculty = require('./models/faculty');
const Course = require('./models/course');
const User = require('./models/user');
const Instructor = require('./models/instructor');
const Reservation = require('./models/reservation');
const Term = require('./models/term');
const InstructorCourse = require('./models/instructor_course');
const Review = require('./models/review');

const app = express();

// application/json content-type expected both for requests and responses
app.use(bodyParser.json());

// to avoid CORS error we need to set the next headers to our API's response:
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // change this later to only our front-end domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// error handling middleware, currently only for 500
app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.httpStatusCode).json(error.message);
});

app.use(pageRoutes); // basic read operations on data catalogues
app.use(authRoutes); // signup and login
app.use(userRoutes); // user actions in application
app.use('/admin', adminRoutes); // admin actions

//TODO: should associating be here or removed somewhere else, maybe in models?

// set foreign key country_id in table city
City.belongsTo(Country, { foreignKey: { allowNull: false } } );
Country.hasMany(City); // This is redundant, but let it be

// set foreign key city_id in table faculty
Faculty.belongsTo(City, { foreignKey: { allowNull: false } });
City.hasMany(Faculty); // This is redundant, but let it be

// set foreign key faculty_id in table course
Course.belongsTo(Faculty, { foreignKey: { allowNull: false } });
Faculty.hasMany(Course);

// set foreign key faculty_id in table user
User.belongsTo(Faculty, { foreignKey: { allowNull: false } });
Faculty.hasMany(User);

// set foreign key city_id in table user
User.belongsTo(City, { foreignKey: { allowNull: false } });
City.hasMany(User);

// set foreign key user_id in table instructor
User.hasOne(Instructor, { foreignKey: { allowNull: false } } );
Instructor.belongsTo(User);

// set foreign key degree_id in table instructor
Instructor.belongsTo(Degree);
Degree.hasMany(Instructor);

// set foreign keys user_id and course_id in table reservation
User.hasOne(Reservation, { foreignKey: { allowNull: false } });
Course.hasOne(Reservation, { foreignKey: { allowNull: false } });
Reservation.belongsTo(Course);
Reservation.belongsTo(User);

// set foreign key instructor_id in table term
Term.belongsTo(Instructor, { foreignKey: { allowNull: false } });
Instructor.hasMany(Term);

// set foreign key reservation_id in table term
Reservation.hasOne(Term);

// set foreign key user_id and instructor_id in table review
Review.belongsTo(User, { foreignKey: { allowNull: false } });
User.hasMany(Review);

Review.belongsTo(Instructor, { foreignKey: { allowNull: false } });
Instructor.hasMany(Review);


// set m:n association between tables instructor and course
Instructor.belongsToMany(Course, { through: InstructorCourse });
Course.belongsToMany(Instructor, { through: InstructorCourse });

// Synchronize models with database. If there is an error, don't start server.
sequelize.sync() // {force: true} for redefinition { logging: console.log } for logging
    .then(result => {
        console.log("Spajanje na bazu uspješno, poslužitelj pokrenut!");
        app.listen(3000);
    })
    .catch(err => console.log(err));

