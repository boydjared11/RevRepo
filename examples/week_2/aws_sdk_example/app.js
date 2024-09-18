const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

// We use commands to interact with DynamoDB Client

const client = new DynamoDBClient({region: "us-west-1"});

/**
 * There is nowhere you actually log-in to the AWS console
 * This is done automatically using the environment variables we setup with our IAM user and their Access keys
 * 
 * 1. AWS_ACCESS_KEY_ID
 * 2. AWS_SECRET_ACCESS_KEY
 * 3. AWS_DEFAULT_REGION
 */

const documentClient = DynamoDBDocumentClient.from(client);

const getCommand = new GetCommand({
    TableName: "test_table_123",
    Key: {'test_key': '1'}
})

// promises
/*
documentClient.send(getCommand)
    .then(data => console.log(data))
    .catch(err => console.error(error));
*/

// Async/Await
async function fetchItem() {
    try {
        const data = await documentClient.send(getCommand);
        console.log(data); // If we don't want all the data we get in the console, put in data.Item or data.Items
    } catch(err) {
        console.error(err);
    }
}

fetchItem();