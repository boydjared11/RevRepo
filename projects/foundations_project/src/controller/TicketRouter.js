const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication');
const ticketService = require('../service/TicketService');

// CREATE
router.post("/", auth.authenticateToken, async (req, res) => {
    const data = await ticketService.postTicket(req.body, req.user.user_id);
    
    if (data) {
        res.status(201).json({message: "Ticket was created", data});
    } else {
        res.status(400).json({message: "Failed to create ticket", receivedData: req.body});
    }
});

// READ
/*
router.get("/", auth.authenticateToken, async (req, res) => {
    const userIdQuery = req.query.userId;

    if (userIdQuery) {
        if (userIdQuery === req.user.user_id) {
            const tickets = await ticketService.getTicketsByUserId(userIdQuery);
            res.status(200).json({tickets});
        } else {
            res.status(400).json({message: "Failed to get tickets by userId"});
        }
    } else {
        res.status(400).json({message: "Invalid userId query"});
    }
});
*/

router.get("/", auth.authenticateToken, async (req, res) => {
    const ticketStatusQuery = req.query.ticketStatus;
    const userIdQuery = req.query.userId;
    
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
    } else if (userIdQuery) {
        if ((userIdQuery === req.user.user_id) || (req.user.role === "Manager")) {
            const tickets = await ticketService.getTicketsByUserId(userIdQuery);
            res.status(200).json({tickets});
        } else {
            res.status(400).json({message: "Failed to get tickets by userId"});
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

router.get("/:ticketId", auth.authenticateManagerToken, async (req, res) => {
    const ticket = await ticketService.getTicketById(req.params.ticketId);

    if (ticket) {
        res.status(200).json({ticket});
    } else {
        res.status(400).json({message: "Failed to find ticket"});
    }
});
/*
router.get("/", auth.authenticateToken, async (req, res) => {
    const tickets = await ticketService.getTicketsByUserId(req.params.userId);

    if (tickets) {
        res.status(200).json({tickets});
    } else {
        res.status(400).json({message: "Failed to get tickets by userId"});
    }
});
*/
// UPDATE
router.put("/:ticketId/", auth.authenticateManagerToken, async (req, res) => {
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
});


// DELETE
router.delete("/:ticketId", auth.authenticateManagerToken, async (req, res) => {
    const data = await ticketService.deleteTicket(req.params.ticketId);

    if (data) {
        res.status(200).json({message: "Ticket was deleted", data});
    } else {
        res.status(400).json({message: "Failed to delete ticket"});
    }
});

module.exports = router;