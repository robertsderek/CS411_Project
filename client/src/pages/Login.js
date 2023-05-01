import React, { useState } from 'react'
import { GoogleLogin , GoogleOAuthProvider} from '@react-oauth/google';
import { OAUTH_API_KEY } from './oauth_credentials'
import axios from 'axios'
import { useNavigate } from "react-router-dom";


export default function Login(){
    const [userEmail, setUserEmail] = useState("");
    const [login, setLogin] = useState(false);
    const navigate = useNavigate();

    const handleLoginSuccess = (credentialResponse) => {
        fetch('http://localhost:3001/oauth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentialResponse)
        })
          .then(response => response.json())
          .then(data => {
            const userEmail = data['email'];
            setUserEmail(userEmail);
            sessionStorage.setItem("login", true);
            navigate('/Calendar', { state: { userEmail } });
          })
          .catch(error => console.log(error))
    }

    const handleLoginError = () => {
        console.log('Login Failed');
    }

    return(
      <div className="Login">
      
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
