const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = (req, res, next ) => {

    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ massage: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};