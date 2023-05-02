import {  React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function AddContent() {
    let map, infoWindow, placesService;
    const [places, setPlaces] = useState([]);

    const {state} = useLocation();
    const {calendarDayItem, day} = state;
    const weather = calendarDayItem.weather;
    const month = calendarDayItem.month;
    const year = calendarDayItem.year;
    const email = calendarDayItem.userEmail;
    const formattedDate = calendarDayItem.formattedDate;

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
                    const contentName = place.name;
                    const contentAddress = place.formatted_address;
            
                    axios.post(`http://localhost:3001/calendar/new?email=${email}&month=${month}&day=${day}&year=${year}&contentName=${contentName}&contentAddress=${contentAddress}`)
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
        <h1>{"Calendar For: " + formattedDate}</h1>
        {weather && (
        <div>
          <p> <b>Current weather: </b> {weather.avgtemp_f} F</p>
          <p> <b>Condition:</b> {weather.condition?.text}</p>
          <p> <b>Max Wind:</b> {weather.maxwind_mph + " miles per hour in direction "}</p>
        </div>
      )}
        <div id="map" style={{ height: "75vh", width: "100%" }}></div>
        </div>
    );
      

    }