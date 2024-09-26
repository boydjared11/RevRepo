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

const userService = require('../src/service/UserService');

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('User Service Functionality Tests', () => {

    beforeEach(() => {
        ddbMock.reset();
      });
    
    test('postUser should return a http status code of 200', async () => {
        ddbMock.on(PutCommand).resolves({
            $metadata: {
                httpStatusCode: 200
            }
        });

        const data = await userService.postUser(
            {
                username: "username1",
                password: "password1",
                role: "Manager"
            }
        );
        expect(ddbMock).toHaveReceivedCommand(PutCommand);
        expect(data.$metadata.httpStatusCode).toBe(200);
    });

    test('postUser should return null because of an invalid user input', async () => {
        const data = await userService.postUser(
            {
                username: "username1",
                role:"Manager"
            }
        );

        expect(data).toBe(null);
    });
    
    test('getAllUsers should return a list of all our Users', async () => {
        ddbMock.on(ScanCommand).resolves({
            Items: [
                {
                    user_id: "user1",
                    username: "username1",
                    password: "password1",
                    role: "Manager"
                }, 
                {
                    user_id: "user2",
                    username: "username2",
                    password: "password2",
                    role: "Employee"
                },
                {
                    user_id: "user3",
                    username: "username3",
                    password: "password3",
                    role: "Employee"
                }
            ]
        });

        const users = await userService.getAllUsers();
        expect(ddbMock).toHaveReceivedCommand(ScanCommand);
        expect(users).toStrictEqual([
            {
                user_id: "user1",
                username: "username1",
                password: "password1",
                role: "Manager"
            }, 
            {
                user_id: "user2",
                username: "username2",
                password: "password2",
                role: "Employee"
            },
            {
                user_id: "user3",
                username: "username3",
                password: "password3",
                role: "Employee"
            }
        ]);
    });

    test('getUserById should return a User by their id', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: [
                {
                    user_id: "user1",
                    username: "username1",
                    password: "password1",
                    role: "Manager"
                }
            ]
        });
        
        const user = await userService.getUserById("user1");
        expect(ddbMock).toHaveReceivedCommand(QueryCommand);
        expect(user).toStrictEqual(
            {
                user_id: "user1",
                username: "username1",
                password: "password1",
                role: "Manager"
            }
        );
    });

    test('getUserById should not return a User since there is no User with the id', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: []
        });
        
        const user = await userService.getUserById("user4");
        expect(ddbMock).toHaveReceivedCommand(QueryCommand);
        expect(user).toStrictEqual(undefined);
    });

    test('getUserByUsername should return a User by their username', async () => {
        ddbMock.on(ScanCommand).resolves({
            Items: [
                {
                    user_id: "user1",
                    username: "username1",
                    password: "password1",
                    role: "Manager"
                }
            ]
        });

        const user = await userService.getUserByUsername("username1");
        expect(ddbMock).toHaveReceivedCommand(ScanCommand);
        expect(user).toStrictEqual(
            {
                user_id: "user1",
                username: "username1",
                password: "password1",
                role: "Manager"
            }
        );
    });

    test('getUserByUsername should not return a User since there is no User with the username', async () => {
        ddbMock.on(ScanCommand).resolves({
            Items: []
        });

        const user = await userService.getUserByUsername("username4");
        expect(ddbMock).toHaveReceivedCommand(ScanCommand);
        expect(user).toStrictEqual(undefined);
    });

    test('getUsersByRole should return a list of Users by their role', async () => {
        ddbMock.on(ScanCommand).resolves({
            Items: [
                {
                    user_id: "user2",
                    username: "username2",
                    password: "password2",
                    role: "Employee"
                },
                {
                    user_id: "user3",
                    username: "username3",
                    password: "password3",
                    role: "Employee"
                }
            ]
        });

        const users = await userService.getUsersByRole("Employee");
        expect(ddbMock).toHaveReceivedCommand(ScanCommand);
        expect(users).toStrictEqual([
            {
                user_id: "user2",
                username: "username2",
                password: "password2",
                role: "Employee"
            },
            {
                user_id: "user3",
                username: "username3",
                password: "password3",
                role: "Employee"
            }
        ]);
    });

    test('updateUser should return a particular User with an updated role', async () => {
        ddbMock.on(UpdateCommand).resolves({
            Attributes: {
                user_id: "user2",
                username: "username2",
                password: "password2",
                role: "Manager"
            }
        });

        const updatedUser = await userService.updateUser("user2", "Manager");
        expect(ddbMock).toHaveReceivedCommand(UpdateCommand);
        expect(updatedUser).toStrictEqual(
            {
                user_id: "user2",
                username: "username2",
                password: "password2",
                role: "Manager"
            }
        );
    });

    test('updateUser should return a new User with the updated role since no User with the id exist', async () => {
        ddbMock.on(UpdateCommand).resolves({
            Attributes: {
                user_id: "user4",
                role: "Manager"
            }
        });

        const updatedUser = await userService.updateUser("user4", "Manager");
        expect(ddbMock).toHaveReceivedCommand(UpdateCommand);
        expect(updatedUser).toStrictEqual(
            {
                user_id: "user4",
                role: "Manager"
            }
        );
    });

    test('deleteUser should return a http status code of 200', async () => {
        ddbMock.on(DeleteCommand).resolves({
            $metadata: {
                httpStatusCode: 200
            }
        });

        const data = await userService.deleteUser("user2");
        expect(ddbMock).toHaveReceivedCommand(DeleteCommand);
        expect(data.$metadata.httpStatusCode).toBe(200);
    });
});