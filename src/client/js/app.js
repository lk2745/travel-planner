/* Global Variables */

let clientData = {};

//GeoNames Sample URL
/* http://api.geonames.org/postalCodeLookupJSON?placename=CITY,STATE&username=USERNAME 
Parameters:
  placename=
  username=
*/
const geoUsername = "&username=lk2745";
const geobaseURL = "http://api.geonames.org/postalCodeLookupJSON?placename=";

/* Weatherbit API Base URL for travel Greater than 16 days out.
HTTP: http://api.weatherbit.io/v2.0/history/daily
HTTPS: https://api.weatherbit.io/v2.0/history/daily

Parameters:
  lat=
  lon=
  start_day=YYYY-MM-DD
  end_day=YYYY-MM-DD
  units=I
  key=API Key

http://api.weatherbit.io/v2.0/history/daily?lat=34.481432568420765&lon=-114.34832746396215&start_day=11-25&end_day=11-26&units=I&key=APIKEY

Travel less than 16 days
  https://api.weatherbit.io/v2.0/forecast/daily?lat=25.909662&lon=-80.247004units=I&key=APIKEY

  Parameters
  lang= en [DEFAULT]
  lat=
  lon=
  days= 16 [DEFAULT]
  units=I
  key=API Key

  */

//Personal API Key for Weatherbit API
const weatherbitAPIKey = "440090c7b16d467eb90c394a408669a2";

//Pixabay
// Pixabay URL Sample - https://pixabay.com/api/?key=${pixabayKey}&category=places&safesearch=true&q=${query}
/*  Return:
"hits": [
        {

  */

const pixabayKey = "18310094-fb5370c6e4eb7d99ed9a28683"

// Event listener to add function to existing HTML DOM element and named callback function as the second parameter

function startApp(e){
  document.getElementById("savetrip").addEventListener("click", performAction);
}



/* Function called by event listener */
function performAction(e) {
  const departingdate = document.getElementById("departdate").value;
  const placename = document.getElementById("citystate").value;
  let ddate = new Date(departingdate);
  let numofdays = calcNumofDays(ddate);
  postData('/add', {info: "daysuntildepart", data:{daysUntil: numofdays}});
  
  //Get Latitude and Longitude from Geonames from Place entry

  getGeonames(geobaseURL, placename, geoUsername)
  .then(function(geodata){
    try {
      let getgeodata = {info: "geoData", data: {city: geodata.placeName, state: geodata.adminName1, country: geodata.countryCode, longitude: geodata.lng, latitude: geodata.lat}};
      postData('/add', getgeodata)
    } catch (error) {
      console.log("Error from Geoname API GET: ", error)
      }
    })
  .then(function() {
    clientData = getServerData();
    return clientData
  })
  .then(function(gdata){
    try {
      gdata = gdata['geoData'];
      let latitude = gdata.latitude;
      let longitude = gdata.longitude;
      let weatherData = getWeatherData(latitude, longitude, departingdate, weatherbitAPIKey);
      return weatherData
      } catch (error) {
        console.log("Error from Weatherbit API GET: ",error);
      }
    })
  .then(function(wData){
    let pwData = {info: "WeatherData", data: {wData}};
    postData('/add',pwData)
  })
  .then(()=> {
    try {
      updateUIElement(departingdate);
    } catch (error) {
      console.log("Error running UpdateUI: ",error);
    } 
  })
}

/* Function to GET GeoNames API Data*/
const getGeonames = async (geobaseURL, placename, geoUsername) => {
  console.log("Running getGeonames function");
  const res = await fetch(geobaseURL + placename + geoUsername)
  try {
    const geodata = await res.json();
    console.log(geodata);
    return geodata.postalcodes[0];
  } catch (error) {
    console.log("error in getGeonames", error);
    // appropriately handle the error
  }
};

/* Calcualate the number of days from departure and current day */
function calcNumofDays(ddate){
  let currentd = new Date(); // Today's date
  let departd = new Date(ddate);
  let departingt = departd.getTime();
  let currentt = currentd.getTime();
  let diffintime = departingt - currentt;
  const dayinms = 1000 * 60 * 60 * 24 ;
  const numofdays = Math.round(diffintime/dayinms)+1; 
  return numofdays;
}

function lastYrdepDay(ddate){
  let d = new Date(ddate);
  let depdate = new Date(ddate);
  depdate.setFullYear(d.getFullYear()-1);
  return depdate.toISOString().slice(0,10);
}


function lastYrnextDay(ddate){
  let n = new Date(ddate);
  let ndate = new Date(ddate);
  ndate.setFullYear(ndate.getFullYear()-1);
  ndate.setDate(n.getDate()+1);
  return ndate.toISOString().slice(0,10);
}

/* Function to POST data */
const postData = async (url = '', data = {}) => {
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


/* Server side data */
const getServerData = async () =>{
  const request = await fetch('/all')
  try{
    clientData = await request.json();
    return clientData;
  } catch(error){
    console.log("Error in getServerData: ", error);
  }
}

/*Get Weatherbit API Weather Data*/
const getWeatherData = async (lat, long, ddate, wkey)=>{
  let weatherbitURL = "http://api.weatherbit.io/v2.0/normals?";

  if (calcNumofDays(ddate) > 16){ //Historical  forecast
    console.log("this is ddate: ", ddate);
    let startdate = lastYrdepDay(ddate);
    console.log("this is startdate: ", startdate);
    let enddate = lastYrnextDay(ddate);
    console.log("this is enddate:", enddate);

    weatherbitURL=`https://api.weatherbit.io/v2.0/history/daily?lat=${lat}&lon=${long}&start_date=${startdate}&end_date=${enddate}&units=I&key=${wkey}`;
    const forecast = "history";
  }
  else{ // Daily Forecast
    weatherbitURL=`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${long}&units=I&key=${wkey}`;
    const forecast = "daily";
  }
  const res = await fetch(weatherbitURL)
  try {
    const wbitdata = await res.json();
    let weatherres ={};
    // Check the weatherbitURL for history test; https://www.w3schools.com/Jsref/jsref_includes.asp 
    if (weatherbitURL.includes('history')){
      weatherres.high = wbitdata.data[0].max_temp;
      weatherres.low = wbitdata.data[0].min_temp;
      weatherres.rain = wbitdata.data[0].precip;
    } else {
      // or use the daily forecast based on the number of days (16 or less) until the departure date 
      let i = calcNumofDays(ddate);
      weatherres.high = wbitdata.data[i].max_temp;
      weatherres.low = wbitdata.data[i].min_temp;
      weatherres.weather = wbitdata.data[i].weather.description;
    }
    console.log("Weatherabit data", weatherres);
    return weatherres;
    } catch(error) {
    console.log("Error getWeatherData() ", error);
  }
}


/* Function to get Pixabay Image and then Update UI */
const updateUIElement = async (date) => {
  console.log("Running Pixabay and Update UI Function");
  clientData = await getServerData()
   .then(clientData => {
     let pixData = clientData['geoData'];
     try {
       let pixhits = getPixabay(pixData,pixabayKey)
       console.log(pixhits);
       return pixhits
     } catch (error) {
       console.log("Error from Pixabay API: ",error)
     }
   })
   .then(pixhits=>{
     clientData["pictureURL"] = pixhits;
     return clientData
   })
   .then(data=>{
    let pixImgURL = data['pictureURL'];
    let daysAway = data['daysuntildepart'].daysUntil;
    let finalcity = data['geoData'].city;
    let finalstate = data['geoData'].state;
    let finalcountry = data['geoData'].country;
    let finalLongitude = data['geoData'].longitude;
    let finalLatitude = data['geoData'].latitude;
    let hightemp = data['WeatherData'].wData.high;
    let lowtemp = data['WeatherData'].wData.low;
    let wdescription = data['WeatherData'].wData.weather;
    let wprecip = data['WeatherData'].wData.rain;

    if (pixImgURL === undefined){
      document.getElementById("travelImg").setAttribute('src',defaultimg);
    } else {
      document.getElementById("travelImg").setAttribute('src',pixImgURL);
    }
    document.getElementById("citystateHolder").innerHTML = `${finalcity}, ${finalstate} is ${daysAway} days away`;
    document.getElementById("countryHolder").innerHTML = `Country: ${finalcountry}`;
    document.getElementById("longitudeHolder").innerHTML = `Longitude: ${finalLongitude}`;
    document.getElementById("latitudeHolder").innerHTML = `Latitude: ${finalLatitude}`;
    document.getElementById("hightempHolder").innerHTML = `High: ${hightemp}°F`;
    document.getElementById("lowtempHolder").innerHTML = `Low: ${lowtemp}°F`;
    if (wdescription !== undefined){
      document.getElementById("typicalweatherHolder").innerHTML = `Outlook: ${wdescription}`;
    }
    if (wprecip !== undefined){
      wprecip = wprecip*100;
      document.getElementById("precipHolder").innerHTML = `Chance of rain is ${wprecip}%`
    }
   })
}



/*Get Pixaby Image information from Geonames data */
const getPixabay= async(data,key)=>{    
  let q = data.city // data.state;
  let pixabayURL = `https://pixabay.com/api/?key=${key}&safesearch=true&category=places&q=${q}`;
  const res = await fetch(pixabayURL);
  try {
    const pixresults = await res.json();
    if(pixresults.totalHits == 0){  //No results for city(placename) 
      q = data.country;//convert country code to string for query
      pixabayURL= `https://pixabay.com/api/?key=${key}&safesearch=true&category=places&q=${q}`;
      const res2 = await fetch(pixabayURL);
      const pixresults2 = await res2.json();
      return pixresults2.hits[0].webformatURL;
    } else{
    return pixresults.hits[0].webformatURL;
    }
  } catch(error) {
    console.log("error in getPic():: ", error);
  }}

  export { startApp }


