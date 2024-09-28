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

const TableName = "Tickets";

// CREATE
async function postTicket(ticket) {
    const command = new PutCommand({
        TableName,
        Item: ticket
    });

    try {
        const data = await documentClient.send(command);
        return data;
    } catch(err) {
        logger.error(err);
    }
}

// READ
async function getAllTickets() {
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

async function getTicketById(ticketId) {
    const command = new QueryCommand({
        TableName,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: {
            "#id": "ticket_id"
        },
        ExpressionAttributeValues: {
            ":id": ticketId
        }
    });
    
    try {
        const data = await documentClient.send(command);
        return data.Items[0];
    } catch(err) {
        logger.error(err);
    }
}

async function getTicketsByStatus(ticketStatus) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#status = :status",
        ExpressionAttributeNames: {
            "#status": "status"
        },
        ExpressionAttributeValues: {
            ":status": ticketStatus
        }
    });

    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch(err) {
        logger.error(err);
    }
}

async function getTicketsByUserId(userId) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#user_id = :user_id",
        ExpressionAttributeNames: {
            "#user_id": "user_id"
        },
        ExpressionAttributeValues: {
            ":user_id": userId
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
async function updateTicket(ticket, ticketStatus) {
    const command = new UpdateCommand({
        TableName,
        Key: {
            ticket_id: ticket.ticket_id,
            time_stamp: ticket.time_stamp
        },
        UpdateExpression: "set #status = :status",
        ExpressionAttributeNames: {
            "#status": "status"
        },
        ExpressionAttributeValues: {
            ":status": ticketStatus
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
async function deleteTicket(ticket) {
    const command = new DeleteCommand({
        TableName,
        Key: {
            ticket_id: ticket.ticket_id,
            time_stamp: ticket.time_stamp
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
    postTicket,
    getAllTickets,
    getTicketById,
    getTicketsByStatus,
    getTicketsByUserId,
    updateTicket,
    deleteTicket
}