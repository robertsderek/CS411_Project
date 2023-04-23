import React, { useState, useEffect } from "react";
import axios from "axios";

function Map() {
  let map, infoWindow, placesService;
  const [places, setPlaces] = useState([]);

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
            getPlaces("establishment", pos);
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
              </div>
            `);
            infoWindow.open(map, marker);
          } else {
            console.error(`Places request failed: ${status}`);
          }
        });
      });
    }
  }
  

  return (
    <div>
      <div id="map" style={{ height: "500px", width: "100%" }}></div>
    </div>
  );
}

export default Map;
