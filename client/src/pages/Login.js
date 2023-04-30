import React, { useState } from 'react'
import { GoogleLogin , GoogleOAuthProvider} from '@react-oauth/google';
import { OAUTH_API_KEY } from './oauth_credentials'
import axios from 'axios'
import { useNavigate } from "react-router-dom";


export default function Login(){
    const [userEmail, setUserEmail] = useState("");
    const [login, setLogin] = useState(false);
    const navigate = useNavigate();
    
    return(
      <div className="Login">
      
        <GoogleOAuthProvider clientId={OAUTH_API_KEY}>
          <GoogleLogin
            text="Login with google"
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

              const user = {userEmail : userEmail}
              axios.get('http://localhost:3001/calendar', { params: user })
                .then(response => console.log(response.data))
                .catch(error => console.error(error));

              //create a session and redirect to Calendar page
              sessionStorage.setItem("login", true);
              navigate('/Calendar');
          }}
          onError={() => {
            console.log('Login Failed');
          }}/>
        </GoogleOAuthProvider>
        </div>
    )
}

