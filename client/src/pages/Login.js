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
              //create a session and redirect to Calendar page
              //call backend call to /oauth to verify credentials and get user's email
              sessionStorage.setItem("credentials", credentialResponse);
              navigate('/Calendar');
          }}
          onError={() => {
            console.log('Login Failed');
          }}/>
        </GoogleOAuthProvider>
        </div>
    )
}

