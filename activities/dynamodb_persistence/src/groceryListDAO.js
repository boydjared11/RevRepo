const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand,
    QueryCommand
} = require("@aws-sdk/lib-dynamodb");

const logger = require("./util/logger");

const client = new DynamoDBClient({region: "us-west-1"});

const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "GroceryList";

// CREATE
async function postItem(Item) {
    const command = new PutCommand({
        TableName,
        Item
    });

    try {
        const data = await documentClient.send(command);
        logger.info(`PUT command to database complete ${JSON.stringify(data)}`);
        return data;
    } catch(err) {
        logger.error(err);
    }
}

// READ
async function getAllItems() {
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

async function getItemById(itemId) {
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: {"#id": "ItemID"},
        ExpressionAttributeValues: {":id": itemId}
    });
    
    try {
        const data = await documentClient.send(command);
        return data.Items[0];
    } catch(err) {
        logger.error(err);
    }
}

async function getItemsByName(itemName) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#name = :name",
        ExpressionAttributeNames: {"#name": "name"},
        ExpressionAttributeValues: {":name": itemName}
    })

    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch(err) {
        logger.error(err);
    }
}

// UPDATE
async function updateItem(itemId) {
    const item = await getItemById(itemId);
    
    const command = new UpdateCommand({
        TableName,
        Key: {ItemID: itemId},
        UpdateExpression: "set purchased = :purchased",
        ExpressionAttributeValues: {
            ":purchased": !item.purchased
        },
        ReturnValues: "ALL_NEW"
    })

    try {
        const data = await documentClient.send(command);
        return data.Attributes;
    } catch(err) {
        logger.error(err);
    }
}

// DELETE
async function deleteItem(itemId) {
    const command = new DeleteCommand({
        TableName,
        Key: {ItemID: itemId}
    });
    
    try {
        const data = await documentClient.send(command);
        return data;
    } catch(err) {
        logger.error(err);
    }
}

module.exports = {
    postItem,
    getAllItems,
    getItemById,
    getItemsByName,
    updateItem,
    deleteItem
}