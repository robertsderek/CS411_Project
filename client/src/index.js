import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

const { OAUTH_API } = require('./oauth_credentials.js')
let key =  OAUTH_API



root.render(
  <GoogleOAuthProvider clientId = {key}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  //</GoogleOAuthProvider>,
  document.getElementById('root')
);