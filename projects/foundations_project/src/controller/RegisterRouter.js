const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const userService = require('../service/UserService');

router.post("/", async (req, res) => {
    let { username, password } = req.body;

    if (username && password) {
        const saltRounds = 10;

        password = await bcrypt.hash(password, saltRounds);

        // find if there is already a user with the username in the database
        const user = await userService.getUserByUsername(username);

        if (!user) {
            const data = await userService.postUser({ username, password });
        
            if (data) {
                res.status(201).json({message: "User successfully registered", data});
            } else {
                res.status(400).json({message: "Failed to register user", receivedData: req.body});
            }
        } else {
            res.status(400).json({message: "Username already exists", receivedData: req.body});
        }
    } else {
        res.status(400).json({message: "Need both a username and password"});
    }
});

module.exports = router;