// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Decalare the  server port
const port = 3000;

// Spin up the server
const server = app.listen(port, listening);

// Callback to debug
function listening() {
  console.log("Server is up and running on port:", port);
}

// Initialize all route with a callback function
app.get('/all', getData);

// Callback function to complete GET '/all'  Item 2. in Development Strategy
function getData(request, response) {
  response.send(projectData);
  console.log(projectData);
}

// POST route Item 2. in Development Strategy
app.post('/weather', addWeather);

function addWeather(request, response) {
  console.log("server side data:", request.body);
  let newEntry = {
    temp: request.body.temp,
    date: request.body.date,
    response: request.body.response,
    city: request.body.city,
    humidity: request.body.humidity
  }
  projectData = newEntry;
  console.log(projectData);
  response.send(projectData);
}
