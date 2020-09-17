/* Global Variables */

const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";

// Personal API Key for OpenWeatherMap API
const apiKey = "&appid=cf4822f935696753a229246ddb152413";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

// Event listener to add function to existing HTML DOM element
// named callback function as the second parameter
document.getElementById("generate").addEventListener("click", performAction);

/* Function called by event listener */
function performAction(e) {
  const feeling = document.getElementById("feelings").value;
  const zipCode = document.getElementById("zip").value;
  getWeather(baseURL, zipCode, apiKey)
    .then(function (data) {
      postData('/weather', {date: newDate, city: data.name, temp: data.main.temp, humidity: data.main.humidity, response: feeling});
    })
    .then(function () {
      updateUIElement();
    });
}

/* Function to GET Web API Data*/
const getWeather = async (baseURL, zip, key) => {
  console.log("Running getWeather function");
  const res = await fetch(baseURL + zip + key);
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
    const tempFahrenheit = Math.round((getData.temp - 273.15) * 1.8 + 32);
    document.getElementById("date").innerHTML = `  Date: ${getData.date}`;
    document.getElementById("city").innerHTML = `  City: ${getData.city}`;
    document.getElementById("temp").innerHTML = `  Temperature: ${tempFahrenheit} degrees Fahrenheit`;
    document.getElementById("humidity").innerHTML = `  Humidity: ${getData.humidity} %`;
    document.getElementById("content").innerHTML = `  My feeling is ${getData.response}`;
  } catch (error) {
    console.log("error", error);
  }
};



