const { createClient } = require("@google/maps");
const GooglePlaces = require("googleplaces");
const axios = require('axios');

//hiding the API key
require('dotenv').config({path: '/Users/derekroberts/Desktop/CS411/CS411_Project/.env'});


const apiKey = process.env.GOOGLE_PLACES_API_KEY


// Create a Maps API client
const mapsClient = createClient({
  key: apiKey,
});

// Create a Places API client
const placesClient = new GooglePlaces(apiKey);


// callback function that is called when the Google Maps API is loaded and ready to be used
function handleApiLoaded(map, maps) {
  const places = new googlePlaces(apiKey);

  // Code for handling the API being loaded goes here
}


async function getPlaceDetails() {
  // Use place ID to create a new Place instance.
  const place = new google.maps.places.Place({
    id: "id",
    requestedLanguage: "en", // optional
  });

  // Call fetchFields, passing the desired data fields.
  await place.fetchFields({ fields: ["displayName", "formattedAddress"] });
  // Show the result
  console.log(place.displayName);
  console.log(place.formattedAddress);
}

async function getPlaces(query) {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`;
  const config = { method: 'get', url: url, headers: {} };
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

//testing the execution of the query
getPlaces('Sushi in Los Angeles')
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
