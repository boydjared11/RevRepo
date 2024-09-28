const { mockClient } = require("aws-sdk-client-mock");
require('aws-sdk-client-mock-jest');
const { 
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand,
    QueryCommand
} = require("@aws-sdk/lib-dynamodb");

const ticketService = require('../src/service/TicketService');

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Ticket Service Functionality Tests', () => {

    beforeEach(() => {
        ddbMock.reset();
    });

    test('postTicket should return a http status code of 200', async () => {
        ddbMock.on(PutCommand).resolves({
            $metadata: {
                httpStatusCode: 200
            }
        });

        const data = await ticketService.postTicket(
            {
                amount: 1000,
                description: "Travel"
            },
            "user2"
        );

        expect(ddbMock).toHaveReceivedCommand(PutCommand);
        expect(data.$metadata.httpStatusCode).toBe(200);
    });

    test('postTicket should return null because of an invalid ticket input', async () => {
        const data = await ticketService.postTicket(
            {
                description: "Travel"
            },
            "user2"
        );

        expect(data).toBe(null);
    });

    test('getAllTickets should return a list of all our Tickets', async () => {
        ddbMock.on(ScanCommand).resolves({
            Items: [
                {
                    ticket_id: "ticket1",
                    time_stamp: 1234567890,
                    amount: 100,
                    description: "description1",
                    status: "Pending",
                    user_id: "user2"

                },
                {
                    ticket_id: "ticket2",
                    time_stamp: 1234567890,
                    amount: 200,
                    description: "description2",
                    status: "Denied",
                    user_id: "user3"

                },
                {
                    ticket_id: "ticket3",
                    time_stamp: 1234567890,
                    amount:  300,
                    description: "description3",
                    status: "Approved",
                    user_id: "user4"

                }
            ]
        });

        const tickets = await ticketService.getAllTickets();
        expect(ddbMock).toHaveReceivedCommand(ScanCommand);
        expect(tickets).toStrictEqual([
            {
                ticket_id: "ticket1",
                time_stamp: 1234567890,
                amount: 100,
                description: "description1",
                status: "Pending",
                user_id: "user2"

            },
            {
                ticket_id: "ticket2",
                time_stamp: 1234567890,
                amount: 200,
                description: "description2",
                status: "Denied",
                user_id: "user3"

            },
            {
                ticket_id: "ticket3",
                time_stamp: 1234567890,
                amount:  300,
                description: "description3",
                status: "Approved",
                user_id: "user4"

            }
        ]);
    });

    test('getTicketById should return a Ticket by their id', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: [
                {
                    ticket_id: "ticket1",
                    time_stamp: 1234567890,
                    amount: 100,
                    description: "description1",
                    status: "Pending",
                    user_id: "user2"
    
                }
            ]
        });

        const ticket = await ticketService.getTicketById("ticket1");
        expect(ddbMock).toHaveReceivedCommand(QueryCommand);
        expect(ticket).toStrictEqual(
            {
                ticket_id: "ticket1",
                time_stamp: 1234567890,
                amount: 100,
                description: "description1",
                status: "Pending",
                user_id: "user2"

            }
        );
    });

    test('getTicketById should not return a Ticket since there is no Ticket with the id', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: []
        });

        const ticket = await ticketService.getTicketById("ticket4");
        expect(ddbMock).toHaveReceivedCommand(QueryCommand);
        expect(ticket).toBe(undefined);
    });

    test('getTicketsByStatus should return a list of Tickets by their status', async () => {
        ddbMock.on(ScanCommand).resolves({
            Items: [
                {
                    ticket_id: "ticket1",
                    time_stamp: 1234567890,
                    amount: 100,
                    description: "description1",
                    status: "Pending",
                    user_id: "user2"
    
                }
            ]
        });

        const tickets = await ticketService.getTicketsByStatus("Pending");
        expect(ddbMock).toHaveReceivedCommand(ScanCommand);
        expect(tickets).toStrictEqual([
            {
                ticket_id: "ticket1",
                time_stamp: 1234567890,
                amount: 100,
                description: "description1",
                status: "Pending",
                user_id: "user2"

            }
        ]);
    });

    test('getTicketsByUserId should return a list of Tickets by their userId', async () => {
        ddbMock.on(ScanCommand).resolves({
            Items: [
                {
                    ticket_id: "ticket1",
                    time_stamp: 1234567890,
                    amount: 100,
                    description: "description1",
                    status: "Pending",
                    user_id: "user2"
    
                }
            ]
        });

        const tickets = await ticketService.getTicketsByUserId("user2");
        expect(ddbMock).toHaveReceivedCommand(ScanCommand);
        expect(tickets).toStrictEqual([
            {
                ticket_id: "ticket1",
                time_stamp: 1234567890,
                amount: 100,
                description: "description1",
                status: "Pending",
                user_id: "user2"
            }
        ]);
    });

    test('updateTicket should return a particular Ticket with an updated role', async () => {
        ddbMock
            .on(QueryCommand).resolves({
                Items: [
                    {
                        ticket_id: "ticket1",
                        time_stamp: 1234567890,
                        amount: 100,
                        description: "description1",
                        status: "Pending",
                        user_id: "user2"
                    }
                ]
            })
            .on(UpdateCommand).resolves({
                Attributes: {
                    ticket_id: "ticket1",
                    time_stamp: 1234567890,
                    amount: 100,
                    description: "description1",
                    status: "Approved",
                    user_id: "user2"
                }
            });

        const ticket = await ticketService.updateTicket("ticket1", "Approved");
        expect(ddbMock).toHaveReceivedCommand(QueryCommand);
        expect(ddbMock).toHaveReceivedCommand(UpdateCommand);
        expect(ticket).toStrictEqual(
            {
                ticket_id: "ticket1",
                time_stamp: 1234567890,
                amount: 100,
                description: "description1",
                status: "Approved",
                user_id: "user2"
            }
        );
    });

    test('updateTicket should return null since the status of the Ticket is not pending', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: [
                {
                    ticket_id: "ticket1",
                    time_stamp: 1234567890,
                    amount: 100,
                    description: "description1",
                    status: "Approved",
                    user_id: "user2"
                }
            ]
        });

        const updatedTicket = await ticketService.updateTicket("ticket1", "Denied");
        expect(ddbMock).toHaveReceivedCommand(QueryCommand);
        expect(updatedTicket).toBe(null);
    });

    test('deleteUser should return a http status code of 200', async () => {
        ddbMock
            .on(QueryCommand).resolves({
                Items: [
                    {
                        ticket_id: "ticket2",
                        time_stamp: 1234567890,
                        amount: 200,
                        description: "description2",
                        status: "Denied",
                        user_id: "user3"
                    }
                ]
            })
            .on(DeleteCommand).resolves({
                $metadata: {
                    httpStatusCode: 200
                }
            });

        const data = await ticketService.deleteTicket("ticket2");
        expect(ddbMock).toHaveReceivedCommand(QueryCommand);
        expect(ddbMock).toHaveReceivedCommand(DeleteCommand);
        expect(data.$metadata.httpStatusCode).toBe(200);
    });

    test('deleteUser should return null since there is no User with the userId that exists', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: []
        });

        const data = await ticketService.deleteTicket("ticket4");
        expect(ddbMock).toHaveReceivedCommand(QueryCommand);
        expect(data).toBe(null);
    });
});