const express = require('express');
const router = express.Router();

const ticketService = require('../service/TicketService');

// CREATE
router.post("/", async (req, res) => {
    const data = await ticketService.postTicket(req.body);
    
    if (data) {
        res.status(201).json({message: "Ticket was created", data});
    } else {
        res.status(400).json({message: "Failed to create ticket", receivedData: req.body});
    }
});

// READ
router.get("/", async (req, res) => {
    const ticketStatusQuery = req.query.ticketStatus;
    
    if (ticketStatusQuery) {
        if (ticketStatusQuery === "Approved" || ticketStatusQuery === "Denied" || ticketStatusQuery === "Pending") {
            const tickets = await ticketService.getTicketsByStatus(ticketStatusQuery);
            if (tickets) {
                res.status(200).json({tickets});
            } else {
                res.status(400).json({message: `Failed to get ${ticketStatusQuery} tickets`});
            }
        } else {
            res.status(400).json({message: "Invalid status query"});
        }
    } else {
        const tickets = await ticketService.getAllTickets();
        if (tickets) {
            res.status(200).json({tickets});
        } else {
            res.status(400).json({message: "Failed to get all tickets"});
        }
    }
});

router.get("/:ticketId", async (req, res) => {
    const ticket = await ticketService.getTicketById(req.params.ticketId);

    if (ticket) {
        res.status(200).json({ticket});
    } else {
        res.status(400).json({message: "Ticket not found"});
    }
});

// UPDATE
router.put("/:ticketId/", async (req, res) => {
    const ticketStatusQuery = req.query.ticketStatus;

    if (ticketStatusQuery === "Approved" || ticketStatusQuery === "Denied") {
        const updatedTicket = await ticketService.updateTicket(req.params.ticketId, ticketStatusQuery);

        if (updatedTicket) {
            res.status(200).json({message: `Ticket status was ${updatedTicket.status}`, updatedTicket});
        } else {
            res.status(400).json({message: "Failed to update ticket status"});
        }
    } else {
        res.status(400).json({message: "Invalid status query"});
    }
})


// DELETE
router.delete("/:ticketId", async (req, res) => {
    const data = await ticketService.deleteTicket(req.params.ticketId);

    if (data) {
        res.status(200).json({message: "Ticket was deleted", data});
    } else {
        res.status(400).json({message: "Failed to delete ticket"});
    }
})

module.exports = router;