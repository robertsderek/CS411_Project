import { GoogleLogin } from '@react-oauth/google';
import { useState, useEffect } from 'react';
import React from 'react';

function Welcome({email}) {
  return (
    <h1>welcome {email}</h1>
  )
}

function Ask(){
  return (
    <h1>LOG IN NOW!</h1>
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
        }}
        onError={() => {
          console.log('Login Failed');
        }}/>
      }
      
    </div>
  )
}

export default App