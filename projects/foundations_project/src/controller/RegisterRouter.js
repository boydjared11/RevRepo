const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const userService = require('../service/UserService');

router.post("/", async (req, res) => {
    let { username, password, role } = req.body;

    const saltRounds = 10;

    password = await bcrypt.hash(password, saltRounds);

    const data = await userService.postUser({ username, password, role });
    
    if (data) {
        res.status(201).json({message: "User successfully registered", data});
    } else {
        res.status(400).json({message: "Failed to register user", receivedData: req.body});
    }
});

module.exports = router;