const http = require('http');
const url = require('url');
const fs = require('fs');

/////////////////////////////////////////
/////////////////////////////////////////
// FUNCTIONS
const replaceTemplate = (temp, product) => {
    const replaceObj = {
        id: /{%ID%}/g,
        productName: /{%PRODUCTNAME%}/g,
        image: /{%IMAGE%}/g,
        from: /{%FROM%}/g,
        nutrients: /{%NUTRIENTS%}/g,
        quantity: /{%QUANTITY%}/g,
        price: /{%PRICE%}/g,
        description: /{%DES%}/g,
    };

    let output = Object.entries(replaceObj).reduce((accText, subArr) => {
        return accText.replace(subArr[1], product[subArr[0]]);
    }, temp);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

/////////////////////////////////////////
/////////////////////////////////////////
// READ FILES
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

/////////////////////////////////////////
/////////////////////////////////////////
// SERVER
const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    // overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const cardsHtml = dataObj.map(v => replaceTemplate(tempCard, v)).join('');
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
        res.end(output);

    // Product page
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    // API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(dataObj);

    // Not found
    } else {
        res.writeHead(404, { 'Content-type': 'text/html', 'my-own-header': 'hello-world' });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(3006, '', () => { console.log('listening to requests on port 3006') });

