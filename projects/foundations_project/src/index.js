const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
    let body = "";

    req
        .on('data', (chunk) => {
            body += chunk;
        })
        .on('end', () => {
            body = body.length > 0 ? JSON.parse(body) : {};

            const contentType = {"ContentType":"application/json"};

            if (req.url.startsWith("/tickets")) {
                let index = req.url.split("/")[2];

                switch (req.method) {
                    // Submit ticket feature
                    case "POST":
                        
                        break;
                    // View previous tickets feature
                    case "GET":

                        break;
                    default:
                        res.writeHead(405, contentType);
                        res.end(JSON.stringify({message: "Invalid Method"}));
                        break;
                }
            } else {
                res.writeHead(404, contentType);
                res.end(JSON.stringify({message: "Invalid Endpoint"}));
            }
        })
})

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})