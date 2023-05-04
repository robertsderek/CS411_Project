import React, { useState } from 'react'
import { GoogleLogin , GoogleOAuthProvider} from '@react-oauth/google';
import { OAUTH_API_KEY } from './oauth_credentials'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import "./Login.css"

export default function Login(){
    const [userEmail, setUserEmail] = useState("");
    const navigate = useNavigate();

    const handleLoginSuccess = (credentialResponse) => {
      // Grab location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          fetch('http://localhost:3001/oauth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentialResponse)
          })
            .then(response => response.json())
            .then(data => {
              const userEmail = data['email'];
              setUserEmail(userEmail);
              navigate('/Calendar', { state: { userEmail: userEmail, location: { latitude, longitude } } });
            })
            .catch(error => console.log(error))
        })
      } else {
        console.log("geolocation did not work");
      }
    }

    const handleLoginError = () => {
        console.log('Login Failed');
    }

    return(
      <div className="Login">
        <h1>Login with Google:</h1>
        <GoogleOAuthProvider clientId={OAUTH_API_KEY}>
          <GoogleLogin
            text="Login with google"
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />
        </GoogleOAuthProvider>
      </div>
    )
}
