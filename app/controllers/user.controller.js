const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config()

exports.create = (req, res) => {
    if( !req.body.email || !req.body.password ) {
        res.status(400).send({ message: "Email and Password cannot be empty!" });
        return;
    }

    const newUser = new User({
        email: req.body.email,
        password: req.body.password,
    });

    User.create(newUser, (error, data) => {
        if(error) {
            res.status(500).send({message:error.message || "Some error"});
        } else {
            res.status(201).send(data);
        }
    });
};

exports.login = (req, res) => {
   if( !req.body.email || !req.body.password ) {
        res.status(400).send({ message: "Email and Password cannot be empty!" });
        return;
    }
    
    User.loginByEmailAndPassword(req.body.email, req.body.password, ( error, user) => {
        if(hasError(res, error))
            return;

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(accessToken, user.id);
        res.json({accessToken, refreshToken});

    });
}

generateAccessToken = (userId) => {
    return jwt.sign( {userId:userId}, process.env.SECRET_KEY, {expiresIn: '1h'} );
}

generateRefreshToken = (accessToken, userId) => {
    return jwt.sign({userId:userId, accessToken:accessToken}, process.env.REFRESH_KEY, {expiresIn: '7d'});
}

hasError = (res, error) => {
    if(error){
        if(error.kind === 'not_found') {
            res.status(401).send( {message:"Invalid email or password"} );
        } else {
            res.status(500).send( {message:"Some error"} )
        }
        return true;
    }

}