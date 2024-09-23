const express = require('express');
const jwt = require('jsonwebtoken');
const logger = require('../util/logger');
const router = express.Router();

// secret key for JWT signing (make sure to make this more secure in some way)
const secretKey = "your-secret-key";

router.get("/", authenticateManagerToken, (req, res) => {
    res.json({message: "Protected Manager Route Accessed", user: req.user});
});

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
        const user = await jwt.verify(token, secretKey);
        return user;
    } catch(err) {
        logger.error(err);
    }
}

module.exports = router;