const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authVerification = async (req, res, next) => {
    const tokenHashKey = process.env.TOKEN_HASHING_KEY;
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, tokenHashKey)
        
        // Find a user with the id from the token,
        // which also has the token inside the tokens array.
        const user = await User.findOne({ _id: decoded._id, 'tokens.token' : token })
        if (!user) {
            throw new Error()
        }
        // Attaching the found user to the request
        // Under the user property
        req.token = token
        req.user = user
        
        next()
    } catch(error) {
        res.status(401).send({
            error: 'Please authenticate'
        })
    }
}

module.exports = authVerification;