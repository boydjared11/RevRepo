const jwt = require('jsonwebtoken');
const logger = require('../util/logger');
require('dotenv').config();

async function authenticateToken(req, res, next) {
    // authorization: "Bearer tokenstring"
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({message: "Unauthorized Access"});
    } else {
        const user = await decodeJWT(token);
        req.user = user; // I think Brian mentioned something about this not being recommended
        next();
    }
}

async function authenticateManagerToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({message: "Unauthorized Access"});
    } else {
        const user = await decodeJWT(token);
        if (user.role !== "Manager") {
            res.status(403).json({message: "Forbidden Access"});
            return;
        }
        req.user = user; // I think Brian mentioned something about this not being recommended
        next();
    }
}

async function decodeJWT(token) {
    try {
        const user = await jwt.verify(token, process.env.SECRET_KEY);
        return user;
    } catch(err) {
        logger.error(err);
    }
}

module.exports = {
    authenticateToken,
    authenticateManagerToken
}