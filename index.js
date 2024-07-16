const http2 = require('http2');
const fs = require('fs');

let ip;
let port;

const server = http2.createSecureServer({
    key: fs.readFileSync('localhost-private.pem'),  // Path to your SSL key file
    cert: fs.readFileSync('localhost-cert.pem'), // Path to your SSL certificate file
}, (req) => {
    ip = req.socket.remoteAddress;
    port = req.socket.remotePort;
    console.log(`ip: ${ip}`);
    console.log(`port: ${port}`);
});

server.on('error', (err) => {
    console.error(err);
});

server.on('settings', (settings) => {
    console.log(settings);
});

server.on('stream', (stream, headers) => {
    console.log();

    const htmlTable = createTableFromJSON(JSON.parse(JSON.stringify(headers)));

    stream.respond({
        'content-type': 'text/html',
        ':status': 200,
    });

    stream.end(
        `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>JSON to HTML Table</title>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h3>IP Adress: ${ip}</h3>
                <h3>Port: ${port}</h3>
                <h3>Headers</h3>
                <div id="table-container">${htmlTable}</div>
            </body>
            </html>
        `
    );
});

server.listen(8443, () => {
    console.log('Server is running on https://localhost:8443');
});

function createTableFromJSON(jsonData) {
    let table = '<table border="1">';
    table += '<tr><th>Key</th><th>Value</th></tr>';

    for (let key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            table += `<tr><td>${key}</td><td>${jsonData[key]}</td></tr>`;
        }
    }

    table += '</table>';
    return table;
}
