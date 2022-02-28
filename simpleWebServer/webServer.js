const http = require('http');
const url = require('url');
const fs = require('fs');

const dataObj = fs.readFileSync(`${__dirname}/data.json`, 'utf-8', (err, data) => {
    return JSON.parse(data);
});

const server = http.createServer((req, res) => {
    const pathName = req.url;

    if (pathName === '/' || pathName === '/overview') {
        res.end('this is the OVERVIEW');
    } else if (pathName === '/product') {
        res.end('this is the PRODUCT');
    } else if (pathName === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(dataObj);
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(3006, '', () => {
    console.log('listening to requests on port 3006');
});

