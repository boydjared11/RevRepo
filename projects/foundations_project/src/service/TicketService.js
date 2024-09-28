const ticketDao = require('../repository/TicketDAO');
const uuid = require('uuid');

// CREATE
async function postTicket(ticket, userId) {
    // validate the ticket
    if (validateTicket(ticket, userId)) {
        let data = await ticketDao.postTicket({
            ticket_id: uuid.v4(),
            time_stamp: Math.floor(new Date().getTime()/1000),
            amount: parseInt(ticket.amount),
            description: ticket.description,
            status: "Pending",
            user_id: userId
        });
        return data;
    }
    return null;
}

function validateTicket(ticket, userId) {
    return (ticket.amount && ticket.description && userId);
}

// READ
async function getAllTickets() {
    const tickets = await ticketDao.getAllTickets();
    return tickets;
}

async function getTicketById(ticketId) {
    const ticket = await ticketDao.getTicketById(ticketId);
    return ticket;
}

async function getTicketsByStatus(ticketStatus) {
    const tickets = await ticketDao.getTicketsByStatus(ticketStatus);
    return tickets;
}

async function getTicketsByUserId(userId) {
    const tickets = await ticketDao.getTicketsByUserId(userId);
    return tickets;
}

// UPDATE
async function updateTicket(ticketId, ticketStatus) {
    const ticket = await ticketDao.getTicketById(ticketId);

    if (ticket.status === "Pending") {
        const updatedTicket = await ticketDao.updateTicket(ticket, ticketStatus);
        return updatedTicket;
    } else {
        return null;
    }

}

// DELETE
async function deleteTicket(ticketId) {
    const ticket = await ticketDao.getTicketById(ticketId);

    if (ticket) {
        const data = await ticketDao.deleteTicket(ticket);
        return data;
    } else {
        return null;
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