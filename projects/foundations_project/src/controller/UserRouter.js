const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication');
const userService = require('../service/UserService');

// CREATE
/*
router.post("/", async (req, res) => {
    const data = await userService.postUser(req.body);
    
    if (data) {
        res.status(201).json({message: "User was created", data});
    } else {
        res.status(400).json({message: "Failed to create user", receivedData: req.body});
    }
});
*/
// READ
router.get("/", auth.authenticateManagerToken, async (req, res) => {
    const userUsernameQuery = req.query.userUsername;
    const userRoleQuery = req.query.userRoleQuery;

    if (userUsernameQuery) {
        const user = await userService.getUserByUsername(userUsernameQuery);
        if (user) {
            res.status(200).json({user});
        } else {
            res.status(400).json({message: `Username ${userUsernameQuery} does not exist`});
        }
    } else if (userRoleQuery) {
        if (userRoleQuery === "Employee" || userRoleQuery === "Manager") {
            const users = await userService.getUsersByRole(userRoleQuery);
            if (users) {
                res.status(200).json({users});
            } else {
                res.status(400).json({message: `Failed to get ${userRoleQuery}s`});
            }
        } else {
            res.status(400).json({message: "Invalid status query"});
        }
    } else {
        const users = await userService.getAllUsers();
        if (users) {
            res.status(200).json({users});
        } else {
            res.status(400).json({message: "Failed to get all users"});
        }
    }
});

router.get("/:userId", auth.authenticateManagerToken, async (req, res) => {
    const user = await userService.getUserById(req.params.userId);

    if (user) {
        res.status(200).json({user});
    } else {
        res.status(400).json({message: "Failed to find user"});
    }
});

// UPDATE
router.put("/:userId/", auth.authenticateManagerToken, async (req, res) => {
    const userRoleQuery = req.query.userRole;

    if (userRoleQuery === "Employee" || userRoleQuery === "Manager") {
        const updatedUser = await userService.updateUser(req.params.userId, userRoleQuery);

        if (updatedUser) {
            res.status(200).json({message: `User's role is now ${updatedUser.role}`, updatedUser});
        } else {
            res.status(400).json({message: "Failed to update user's role"});
        }
    } else {
        res.status(400).json({message: "Invalid role query"});
    }
});

// DELETE
router.delete("/:userId", auth.authenticateManagerToken, async (req, res) => {
    const data = await userService.deleteUser(req.params.userId);

    if (data) {
        res.status(200).json({message: "User was deleted", data});
    } else {
        res.status(400).json({message: "Failed to delete user"});
    }
});

module.exports = router;