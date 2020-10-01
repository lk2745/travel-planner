//Used code from Project 3
// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

const dotenv = require("dotenv");
dotenv.config();

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
app.use(express.static('dist'));

// Decalare the  server port
const port = 3000;

// Spin up the server
const server = app.listen(port, listening);

// Callback to console
function listening() {
  console.log("Server Travel App is up and running on port:", port);
}

app.get('/', function (request, response) {
  /*response.sendFile('dist/index.html'); once prod build*/
  response.sendFile('./client/views/index.html');
})

// Initialize all route with a callback function
app.get('/all', getData);

// Callback function to complete GET '/all' 
function getData(request, response) {
  response.send(projectData);
  console.log(projectData);
}

// POST route 
app.post('/add', addPost);

function addPost(request, response) {
  console.log("server side data:", request.body);
  
  projectData[request.body.info] = request.body.data;
  console.log(projectData);
  response.send(projectData);
}
