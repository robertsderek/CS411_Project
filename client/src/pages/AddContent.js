import {  React, useState, useEffect } from "react";
import axios from "axios";
import { get_current_weather } from 'weather.js'; // import get_current_weather function from weather.js

export default function AddContent() {
    let map, infoWindow, placesService;
    const [places, setPlaces] = useState([]);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
        setDate(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);
  
    useEffect(() => {
      initMap();
    }, []);
  
    async function initMap() {
      map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 40.7128, lng: -74 },
        zoom: 6,
      });
      infoWindow = new window.google.maps.InfoWindow();
      placesService = new window.google.maps.places.PlacesService(map);
  
      const locationButton = document.createElement("button");
  
      locationButton.textContent = "Pan to Current Location";
      locationButton.classList.add("custom-map-control-button");
      map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(locationButton);
      locationButton.addEventListener("click", () => {
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
  
              infoWindow.setPosition(pos);
              infoWindow.setContent("Location found.");
              infoWindow.open(map);
              map.setCenter(pos);

             const q = `${position.coords.latitude},${position.coords.longitude}`;

             // fetch current weather using the q parameter
             get_current_weather(q).then((data) => {
                console.log(data);
                 setCurrentWeather(data);
             });
  
              // Call getPlaces with the search term
              getPlaces("activities", pos);
            },
            () => {
              handleLocationError(true, infoWindow, map.getCenter());
            }
          );
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      });
    }
  
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        browserHasGeolocation
          ? "Error: The Geolocation service failed."
          : "Error: Your browser doesn't support geolocation."
      );
      infoWindow.open(map);
    }
  
    async function getPlaces(searchTerm, location) {
      const request = {
        location: location,
        radius: "10000",
        type: [searchTerm],
      };
      const placesData = await new Promise((resolve, reject) => {
        placesService.nearbySearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });
      setPlaces(placesData);
  
      axios.post("http://localhost:3001/api/location", {
        lat: location.lat,
        lng: location.lng,
      })
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error(error);
      });
    
      // Display the places on the map
      for (let i = 0; i < placesData.length; i++) {
        const place = placesData[i];
        const marker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: map,
          title: place.name,
        });
        marker.addListener("click", () => {
          placesService.getDetails({ placeId: place.place_id }, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              infoWindow.setContent(`
                <div>
                  <h2>${place.name}</h2>
                  <p>${place.formatted_address}</p>
                  <p>${place.formatted_phone_number}</p>
                  <p>${place.website}</p>
                  <p>Rating: ${place.rating}/5</p>
                  <button id="addToCalendarButton">Add to Calendar</button>
                </div>
              `);
              infoWindow.open(map, marker);
              // Handle button click event
                const addToCalendarButton = document.getElementById('addToCalendarButton');
                addToCalendarButton.addEventListener('click', () => {
                    const email = "temp@example.com";
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const day = date.getDate().toString().padStart(2, '0');
                    const year = date.getFullYear().toString();
                    const content = `${place.name}, ${place.formatted_address}`;
            
                    axios.post("http://localhost:3001/calendar/new", {
                      email,
                      month,
                      day,
                      year,
                      content,
                    })
                    .then(response => {
                      console.log(response.data.message);
                    })
                    .catch(error => {
                      console.error(error);
                    });
                  });
                } else {
                  console.error(`Places request failed: ${status}`);
                }
          });
        });
      }
    }

    return (
        <div>
        <h1>{"Today is: " + date.toLocaleDateString()}</h1>
        {currentWeather && (
        <div>
          <p> <b>Current weather: </b> {currentWeather.current.temp_f} F</p>
          <p> <b>Feels like:</b> {currentWeather.current.feelslike_f} F</p>
          <p> <b>Wind:</b> {currentWeather.current.wind_mph + " miles per hour in direction " + currentWeather.current.wind_dir}</p>
        </div>
      )}
        <div id="map" style={{ height: "530px", width: "100%" }}></div>
        </div>
    );
      

    }