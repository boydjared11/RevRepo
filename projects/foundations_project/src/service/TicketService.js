const ticketDao = require('../repository/TicketDAO');
const uuid = require('uuid');

// CREATE
async function postTicket(ticket) {
    // validate the ticket
    if (validateTicket(ticket)) {
        let data = await ticketDao.postTicket({
            ticket_id: uuid.v4(),
            amount: parseInt(ticket.amount),
            description: ticket.description,
            status: "Pending"
        });
        return data;
    }
    return null;
}

function validateTicket(ticket) {
    return (ticket.amount && ticket.description);
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

// UPDATE
async function updateTicket(ticketId, ticketStatus) {
    const updatedTicket = await ticketDao.updateTicket(ticketId, ticketStatus);
    return updatedTicket;
}

// DELETE
async function deleteTicket(ticketId) {
    const data = await ticketDao.deleteTicket(ticketId);
    return data;
}

module.exports = {
    postTicket,
    getAllTickets,
    getTicketById,
    getTicketsByStatus,
    updateTicket,
    deleteTicket
}