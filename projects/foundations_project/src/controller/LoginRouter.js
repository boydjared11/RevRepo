const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
require('dotenv').config();

const userService = require('../service/UserService');

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
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
                process.env.SECRET_KEY,
                {
                    expiresIn: "30m" // token expiration time (adjust as need)
                }
            );

            res.json({token});
        }
    } else {
        res.status(400).json({message: "Need both a username and password"});
    }
});

module.exports = router;

