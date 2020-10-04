// startup.js Moved snippet for code from server.js to deal with Jest Test

const app = require('./server.js')
const port = 3000;

app.listen(port, listening);

// Callback to console for debug info
function listening(){
    console.log(`Server Travel App is up and running on localhost port: ${port}`);
};

// Spin up the server
const server = app.listen(port, listening);

