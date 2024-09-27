const userDao = require('../repository/UserDAO');
const uuid = require('uuid');

// CREATE
async function postUser(user) {
    // validate the user
    if (validateUser(user)) {
        let data = await userDao.postUser({
            user_id: uuid.v4(),
            username: user.username,
            password: user.password,
            role: "Employee"
        });
        return data;
    }
    return null;
}

function validateUser(user) {
    return (user.username && user.password);
}

// READ
async function getAllUsers() {
    const users = await userDao.getAllUsers();
    return users;
}

async function getUserById(userId) {
    const user = await userDao.getUserById(userId);
    return user;
}

async function getUserByUsername(userName) {
    const user = await userDao.getUserByUsername(userName);
    return user;
}

async function getUsersByRole(userRole) {
    const users = await userDao.getUsersByRole(userRole);
    return users;
}

// UPDATE
async function updateUser(userId, userRole) {
    const updatedUser = await userDao.updateUser(userId, userRole);
    return updatedUser;
}

// DELETE
async function deleteUser(userId) {
    const data = await userDao.deleteUser(userId);
    return data;
}

module.exports = {
    postUser,
    getAllUsers,
    getUserById,
    getUserByUsername,
    getUsersByRole,
    updateUser,
    deleteUser
}