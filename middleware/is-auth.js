const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let decodedToken;
    const token = req.get('Authorization').split(' ')[1];
    console.log(token);
    try{
        decodedToken = jwt.verify(token, 'secret');
    }
    catch(err){
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken){
        const error = new Error('Not authenticated!');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    console.log('iz auth:' + req.userId);
    console.log(decodedToken.isAdmin);
    req.isAdmin = decodedToken.isAdmin;
    next();
};