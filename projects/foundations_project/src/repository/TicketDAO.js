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

// UPDATE
async function updateTicket(ticketId, ticketStatus) {
    const ticket = await getTicketById(ticketId);

    if (ticket.status === "Pending") {
        const command = new UpdateCommand({
            TableName,
            Key: {
                ticket_id: ticketId
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
    } else {
        return null;
    }
}

// DELETE
async function deleteTicket(ticketId) {
    const command = new DeleteCommand({
        TableName,
        Key: {
            ticket_id: ticketId
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
    updateTicket,
    deleteTicket
}