const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

const userService = require('../service/UserService');

// secret key for JWT signing (make sure to make this more secure in some way)
const secretKey = "your-secret-key";

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    // find the user in the database
    const user = await userService.getUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({message: "Invalid Credentials"});
    } else {
        // generate the JWT token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                role: user.role
            },
            secretKey,
            {
                expiresIn: "15m" // token expiration time (adjust as need)
            }
        );

        res.json({token});
    }
});

module.exports = router;

