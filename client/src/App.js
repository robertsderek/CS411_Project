import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import React from 'react';
import Map from "./Map";

function Welcome({ email }) {
  return (
    <h1>Welcome {email}</h1>
  )
}

function Ask() {
  return (
    <h1>LOG IN NOW!</h1>
  )
}

function App() {
  const [userEmail, setUserEmail] = useState("")
  const [login, setLogin] = useState(false)
  
  const [searchTerm, setSearchTerm] = useState('');
  const [places, setPlaces] = useState([]);

  const handleSearch = async () => {
    console.log("Search button clicked with search term:", searchTerm);
    //send search request to back end
    try {
      const response = await fetch(`/api/places?query=${searchTerm}`);
      const places = await response.json();
      setPlaces(places.reysults);
      console.log(places);
      console.log(places.results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      {login
        ? <Welcome email={userEmail} />
        : <GoogleLogin
          onSuccess={async (credentialResponse) => {
            fetch('http://localhost:3001/oauth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(credentialResponse)
            })
              .then(response => response.json())
              .then(data => setUserEmail(data['email']))
              .then(_ => setLogin(true))
              .catch(error => console.log(error))
          }}
          onError={() => {
            console.log('Login Failed');
          }} />
      }

      <h1>Welcome to Calendar</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <Map searchTerm={searchTerm} location={{ lat: 0, lng: 0 }} places={places} />

    </div>
  )
}

export default App;
