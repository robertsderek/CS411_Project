import { GoogleLogin } from '@react-oauth/google';
import { useState, useEffect } from 'react';
import React from 'react';
import Map from "./Map";
import axios from "axios"

function Welcome({email}) {
  return (
    <h1>welcome {email}</h1>
  )
}

function App() {
  const [userEmail, setUserEmail] = useState("")
  const [login, setLogin] = useState(false)

  return (
    <div className="App">

      {login 
        ? <Welcome email={userEmail}/> 
        : <GoogleLogin
        onSuccess={async (credentialResponse) => {
            fetch('http://localhost:3001/oauth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentialResponse)})
              .then(response => response.json())
              .then(data => setUserEmail(data['email']))
              .then(_ => setLogin(true))
              .catch(error => console.log(error))

            const user = {userEmail : userEmail}
            axios.get('http://localhost:3001/calendar', { params: user })
              .then(response => console.log(response.data))
              .catch(error => console.error(error));
        }}
        onError={() => {
          console.log('Login Failed');
        }}/>
      }
      

      <h1>Welcome to Calendar</h1>
      <Map />
      
    </div>
  )
}

export default App