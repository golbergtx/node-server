const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
    key: fs.readFileSync('localhost-private.pem'),  // Path to your SSL key file
    cert: fs.readFileSync('localhost-cert.pem'), // Path to your SSL certificate file
}, (req) => {
    console.log('zalupa');
    console.log(req.remoteAddress);
    // console.log(req.socket?.remoteAddress);
    // console.log(req.connection.socket.remoteAddress);
    console.log(req);
});

server.on('error', (err) => {
    console.error(err);
});

server.on('settings', (settings) => {
    console.log(settings);
});

server.on('stream', (stream, headers) => {
    // console.log('headers');
    // console.log(headers);

    stream.respond({
        'content-type': 'text/html',
        ':status': 200,
    });
    stream.end('<html><head><title>HTTP/2 Server</title></head><body><h1>Hello, HTTP/2!</h1></body></html>');
});

server.listen(8443, () => {
    console.log('Server is running on https://localhost:8443');
});
