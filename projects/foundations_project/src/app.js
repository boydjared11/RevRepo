const express = require('express');
const app = express();
const logger = require('./util/logger');
const userRouter = require('./controller/UserRouter');
const ticketRouter = require('./controller/TicketRouter');

const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Incoming ${req.method}: ${req.url}`);
    next();
});

app.use("/users", userRouter);
app.use("/tickets", ticketRouter);

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});