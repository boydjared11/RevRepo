const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand,
    QueryCommand
} = require('@aws-sdk/lib-dynamodb');

const logger = require('../util/logger');

const client = new DynamoDBClient({region: "us-west-1"});

const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "Users";

// CREATE
async function postUser(user) {
    const command = new PutCommand({
        TableName,
        Item: user
    });

    try {
        const data = await documentClient.send(command);
        return data;
    } catch(err) {
        logger.error(err);
    }
}

// READ
async function getAllUsers() {
    const command = new ScanCommand({
        TableName
    });
    
    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch(err) {
        logger.error(err);
    }
}

async function getUserById(userId) {
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: {
            "#id": "user_id"
        },
        ExpressionAttributeValues: {
            ":id": userId
        }
    });
    
    try {
        const data = await documentClient.send(command);
        return data.Items[0];
    } catch(err) {
        logger.error(err);
    }
}

async function getUserByUsername(userName) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {
            "#username": "username"
        },
        ExpressionAttributeValues: {
            ":username": userName
        }
    });

    try {
        const data = await documentClient.send(command);
        return data.Items[0];
    } catch(err) {
        logger.error(err);
    }
}

async function getUsersByRole(userRole) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#role = :role",
        ExpressionAttributeNames: {
            "#role": "role"
        },
        ExpressionAttributeValues: {
            ":role": userRole
        }
    });

    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch(err) {
        logger.error(err);
    }
}

// UPDATE
async function updateUser(userId, userRole) {
    const command = new UpdateCommand({
        TableName,
        Key: {
            user_id: userId
        },
        UpdateExpression: "set #role = :role",
        ExpressionAttributeNames: {
            "#role": "role"
        },
        ExpressionAttributeValues: {
            ":role": userRole
        },
        ReturnValues: "ALL_NEW"
    });

    try {
        const data = await documentClient.send(command);
        return data.Attributes;
    } catch(err) {
        logger.error(err);
    }
}

// DELETE
async function deleteUser(userId) {
    const command = new DeleteCommand({
        TableName,
        Key: {
            user_id: userId
        }
    });
    
    try {
        const data = await documentClient.send(command);
        return data;
    } catch(err) {
        logger.error(err);
    }
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