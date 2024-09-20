const http = require('http');
const groceryListService = require('./groceryListService');
const logger = require('./util/logger');

const PORT = 3000;

const server = http.createServer((req, res) => {
    let body = "";

    req
        .on('data', (chunk) => {
            body += chunk;
        })
        .on("end", async () => {
            body = body.length > 0 ? JSON.parse(body) : {};
            
            const contentType = {"Content-Type":"application/json"};

            if (req.url.startsWith("/items")){
                //logger.info(req.url.split('/'));
                logger.info(`Incoming ${req.method}: ${req.url}`);
                let itemId = req.url.split("/")[2];

                switch(req.method){
                    case "POST":
                        const postData = await groceryListService.postItem(body);

                        if (postData) {
                            res.writeHead(201, contentType);
                            res.end(JSON.stringify({message: `Created Item ${body.name}`, postData}));
                        } else {
                            res.writeHead(400, contentType);
                            res.end(JSON.stringify({message: "Please provide valid name and price"}));
                        }
                        break;
                    case "GET":
                        const items = await groceryListService.getAllItems();

                        if (items) {
                            res.writeHead(200, contentType);
                            res.end(JSON.stringify({items}));
                        } else {
                            res.writeHead(400, contentType);
                            res.end(JSON.stringify({message: "Failed to get all items"}));
                        }
                        break;
                    case "PUT":
                        const updatedItem = await groceryListService.updateItem(itemId);

                        if (updatedItem) {
                            res.writeHead(200, contentType);
                            res.end(JSON.stringify({message: `Purchase status of Item ${updatedItem.name} was updated`, updatedItem}));
                        } else {
                            res.writeHead(400, contentType);
                            res.end(JSON.stringify({message: "Failed to update item"}));
                        }
                        break;
                    case "DELETE":
                        const deleteData = await groceryListService.deleteItem(itemId);

                        if (deleteData) {
                            res.writeHead(200, contentType);
                            res.end(JSON.stringify({message: "Item was deleted", deleteData}));
                        } else {
                            res.writeHead(400, contentType);
                            res.end(JSON.stringify({message: "Failed to delete item"}));
                        }
                        break;
                    default:
                        res.writeHead(405, contentType);
                        res.end(JSON.stringify({message: "Invalid Method"}))
                        break;
                }
            }else{
                res.writeHead(404, contentType);
                res.end(JSON.stringify({message: "Invalid Endpoint"}))
            }

        })
});

server.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
})