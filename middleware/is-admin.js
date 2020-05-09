const isAuth = require('./is-auth');

module.exports = (req, res, next) => {
    const isAdmin = req.isAdmin;
    console.log(req.isAdmin);
    if(isAdmin == 0){
        console.log("nisi admin");
        const err = new Error();
        err.statusCode = 401; // not admin
        err.message = "nisi admin!";
        throw err;
    }
    else{
        console.log("jesi admin");
    }
    next();
};