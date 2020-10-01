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
HTTP: http://api.weatherbit.io/v2.0/normals
HTTPS: https://api.weatherbit.io/v2.0/normals

Parameters:
  lat=
  lon=
  start_day=
  end_day=
  units=I
  key=API Key

http://api.weatherbit.io/v2.0/normals ?lat=34.481432568420765&lon=-114.34832746396215&start_day=11-25&end_day=11-26&units=I&key=APIKEY

Travel less than 16 days
  https://api.weatherbit.io/v2.0/forecast/daily?lat=25.909662&lon=-80.247004&start_date=09/30/2020&end_date=10/6/2020units=I&key=APIKEY

  Parameters
  lat=
  lon=
  start_day=
  end_day=
  units=I
  key=API Key

  */

//Personal API Key for Weatherbit API
const weatherbitAPIKey = "&key=440090c7b16d467eb90c394a408669a2";

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

// Create a curent date instance
let currentd = new Date(); //Tue Sep 29 2020 17:08:46 GMT-0400 (Eastern Daylight Time) format
let currentDate = currentd.getFullYear() + "/" + currentd.getMonth()+1 + "/" + currentd.getDate(); //Year, Month, and Day
let currentt = currentd.getTime(); //current date in Milliseconds from Jan. 1, 1970





/* Function called by event listener */
function performAction(e) {
  const departingdate = document.getElementById("departdate").value;
  const placename = document.getElementById("citystate").value;
  const dayinms = 1000 * 60 * 60 * 24;
  let ddate = new Date(departingdate);
  let departingt = ddate.getTime();
  let diffintime = departingt - currentt;
  const numofdays = Math.round(diffintime/dayinms); 
  postData('/add', {info: "daysuntildepart", data:{daysUntil: numofdays}});
  
  //Get Latitude and Longitude from Geonames from Place entry

  getGeonames(geobaseURL, placename, geoUsername)
  .then(function(geodata){
    try {
      let geodata = {info: "geoData", data: {city: geodata.postalcodes[0].placeName, state: geodata.postalcodes[0].adminName1, country: geodata.postalcodes[0].countryCode, longitude: geodata.postalcodes[0].lng, latitude: geodata.postalcodes[0].lat}};
      postData('/add', geodata)
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
    let pwData = {info: "WeatherData", data: wData};
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
    return geodata;
  } catch (error) {
    console.log("error in getGeonames", error);
    // appropriately handle the error
  }
};

/* Function to POST data */
const postData = async (url = '/add', data = {}) => {
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
    return clientlData;
  } catch(error){
    console.log("Error in getServerData: ", error);
  }
}

/*Get Weatherbit API Weather Data*/
const getWeatherData = async (lat, long, ddate, wkey)=>{
  let weatherbitURL = "http://api.weatherbit.io/v2.0/normals?";
  if (numofdays > 16){ //Historical Normal forecast
    let startDate = ddate.getMonth()+1 + "-" + ddate.getDate();
    let endDate = ddate.getMonth()+1 + "-" + ddate.getDate()+1;
    weatherbitURL=`https://api.weatherbit.io/v2.0/history/daily?lat=${lat}&lon=${long}&start_date=${startdate}&end_date=${endDate}&units=I&key=${wkey}`;
    let forecast = "history";
  }
  else{ // Daily Forecast
    weatherbitURL=`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${long}&start_date=${startdate}&end_date=${endDate}&units=I&key=${wkey}`;
    let forecast = "daily";
  }
  const res = await fetch(weatherbitURL)
  try {
    const wbitdata = await res.json();
    let weatherres ={};
    if (forecast = "history"){
      weatherres.high = wbitdata.data[0].max_temp;
      weatherres.low = wbitdata.data[0].min_temp;
      weatherres.rain = wbitdata.data[0].precip;
    } else {
      weatherres.high = wbitdata.data[0].high_temp;
      weatherres.low = wbitdata.data[0].low_temp;
      weatherres.weather = wbitdata.data[0].weather.description;
    }
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
    let daysAway = data['dayuntildepart'].daysUntil;
    let finalcity = data['geodata'].city;
    let finalstate = data['geodata'].state;
    let finalcountry = data['geodate'].country;
    let finalLongitude = data['geodata'].longitude;
    let finalLatitude = data['geodata'].latitude
    let hightemp = data['WeatherData'].max_temp;
    let lowtemp = data['WeatherData'].min_temp;
    let wdescription = data['WeatherData'].description;

    if (pixImgURL === undefined){
      document.querySelector('.travelImg').setAttribute('src',defaultimg);
    } else {
      document.querySelector('.travelImg').setAttribute('src',pixImgURL);
    }
    document.getElementById("citystateHolder").innerHTML = `${finalcity} ,${finalstate} is ${daysAway} days away`;
    document.getElementById("countryHolder").innerHTML = `Country: ${finalcountry}`;
    document.getElementById("longitudeHolder").innerHTML = `Longiture: ${finalLongitude}`;
    document.getElementById("latitudeHolder").innerHTML = `Latitude: ${finalLatitude}`;
    document.getElementById("hightemp").innerHTML = `High: ${hightemp}`;
    document.getElementById("lowtemp").innerHTML = `Low: ${lowtemp}`;
    document.getElementById("TypicalweatherHolder").innerHTML = `${wdescription}`
   })
}



/*Get Pixaby Image information from Geonames data */
const getPixabay= async(data,key)=>{   //geodata 
  let q = data.city + data.state;
  let pixabayURL = `https://pixabay.com/api/?key=${key}&safesearch=true&category=places&q=${q}`;
  const res = await fetch(pixabayURL);
  try {
    const pixresults = await res.json();
    if(pixresults.totalHits == 0){  //No results for city(placename) and state
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


