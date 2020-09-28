/* Global Variables */
//GeoNames Sample URL
/* http://api.geonames.org/postalCodeLookupJSON?placename=CITY,STATE&username=USERNAME 

Parameters:
  placename=
  username=

*/

const geoUsername = "&username=lk2745";
const geobaseURL = "http://api.geonames.org/postalCodeLookupJSON?placename=";

/* Weatherbit API Base URL
HTTP: http://api.weatherbit.io/v2.0/normals
HTTPS: https://api.weatherbit.io/v2.0/normals

Parameters:
  lat=
  lon=
  start_day=
  end_day=
  key=API Key

  http://api.weatherbit.io/v2.0/normals?lat=25.909662&lon=-80.247004&key=APIKEY
  */

//Personal API Key for Weatherbit API
const weatherbitAPIKey = "&key=440090c7b16d467eb90c394a408669a2";
const weatherbitbaseURL = "http://api.weatherbit.io/v2.0/normals?";

// Create a curent date instance
let currentd = new Date();
let currentDay = currentd.getMonth()+1 + "-" + currentd.getDate();


// Event listener to add function to existing HTML DOM element
// named callback function as the second parameter
document.getElementById("savetrip").addEventListener("click", performAction);

/* Function called by event listener */
function performAction(e) {
  const departingdate = document.getElementById("departdate").value;
  const placename = document.getElementById("citystate").value;
  //const numofdays = currentd.getTime() - departingdate.getTime();

  getGeonames(geobaseURL, placename, geoUsername)
    .then(function (data) {
      postData('/geonames', {countrycode: data.postalcodes[0].countryCode, longitude: data.postalcodes[0].lng, latitude: data.postalcodes[0].lat, departdate: departingdate});
    })
    .then(function () {
      updateUIElement();
    });
}

/* Function to GET GeoNames API Data*/
const getGeonames = async (geobaseURL, placename, geoUsername) => {
  console.log("Running getGeonames function");
  const res = await fetch(geobaseURL + placename + geoUsername);
  try {
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error", error);
    // appropriately handle the error
  }
};

/* Function to POST data */
const postData = async (url = "", data = {}) => {
  console.log("postData Function running", data);
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

/* Function to Update UI */
const updateUIElement = async () => {
  console.log("Running Update UI Function");
  const request = await fetch('/all');
  try {
    const getData = await request.json();
    document.getElementById("date").innerHTML = `  Date: ${getData.date}`;
    document.getElementById("citystateHolder").innerHTML = `  City: ${getData.city}`;
    document.getElementById("countryHolder").innerHTML = `Country: ${getData.countrycode}`;
    document.getElementById("longitureHolder").innerHTML = `Longiture: ${getData.longitude}`;
    document.getElementById("latitudeHolder").innerHTML = `Latitude: ${getData.latiture}`;

  } catch (error) {
    console.log("error", error);
  }
};



