# CAPSTONE Travel App Project

## Overview
The project builds off of project 3 (weatherapp) and 4 (new-evaluate-article). This project at three Web APIs to geonames, weatherbit, and pixabay. 

## Author
Larry Keefer

## Description
The web app captures the city/state or city/country along with trip departure date.   The data is sent to geonames to update/capture city, state, country, longitude, and latitude.  The longitude and latitude along with the departing date, which calculate the number of days until the trip is used to get data from Weatherbit.  From Weatherbit, the high, low temp, overall weather or rain, and weather icon information is saved.  It is trip is 16 days or less out the daily forecast data is used, otherwise historical date info is used.  The city/state/country information is used to get data from Pixabay to get an image related to the city/state.

## Extend your Project Items
	Pull in an image for the country from Pixabay API when the entered location brings up no results.  If image is undefined for city/state use the country.

  Incorporate icon into the forcast (From Weatherbit).  Downloaded Icon Images from Weatherbit. Used copy-webpack-plugin webpack plugin to copy images to dist\images\icons during
  the build.

## Instructions


### Step 1 Install express
`npm install express`

### Step 2 Install Dependencies

`npm install cors`
`npm i -D @babel/core @babel/preset-env babel-loader`
`npm install body-parser`
`npm i -D style-loader node-sass css-loader sass-loader`
`npm i -D clean-webpack-pluginweb`
`npm i --save-dev webpack`
`npm i -D html-webpack-plugin`
`npm i -D mini-css-extract-plugin`
`npm i -D optimize-css-assets-webpack-plugin terser-webpack-plugin`
`npm install url-loader file-loader --sav-dev`
`npm i -D webpack-dev-server`
`npm install --save-dev copy-webpack-plugin`

I had to update webpack based on interdependencing with other installs.
`npm install webpack@4.36.0`


### Step 3 Using the APIs
  Create accounts at the following Web APIs sites:
  * http://www.geonames.org/export/web-services.html 
  * https://www.weatherbit.io/account/login
  * https://pixabay.com/service/about/api/
  


### Step 4 Update html, css, index, server, app js files

server.js server listening on port 3000.  

The app.js is applicaiton script with supporting functions to calcNumofDays, lastYrdepDay, and lastYrnextDay.



### Step 5 Build both a dev and production 
`npm run build-dev`

Dev-Server was running on port 8080

`npm run build-prod`

Production was running on port 3000.  


### Step 6 Testing with Jest

Ran the jest test for the overall functionality of the handleSubmit function.
`npm install --save-dev jest`

\Front End Developer\Projects\travel-planner> `npm run test`


### Step 7 Service Worker Setup

Installed the Service Worker:
`npm install workbox-webpack-plugin --save-dev`




  



